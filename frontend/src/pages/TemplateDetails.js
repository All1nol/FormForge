import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TemplateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [template, setTemplate] = useState(null);
  const [forms, setForms] = useState([]);
  const [aggregatedResults, setAggregatedResults] = useState({});
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [accessType, setAccessType] = useState('all'); // 'all' or 'specific'
  const [allowedUsers, setAllowedUsers] = useState([]);

  useEffect(() => {
    fetchTemplateData();
  }, [id]);

  const fetchTemplateData = async () => {
    try {
      const templateResponse = await api.getTemplateById(id);
      const template = templateResponse.data;
      setTemplate(template);
      setTitle(template.title);
      setDescription(template.description);
      setQuestions(template.questions);
      setAccessType(template.accessType || 'all');
      setAllowedUsers(template.allowedUsers || []);

      // Fetch submitted forms
      const formsResponse = await api.getTemplateSubmissions(id);
      setForms(formsResponse.data);
      
      // Calculate aggregated results
      calculateAggregatedResults(formsResponse.data);
    } catch (error) {
      setError('Failed to fetch template data');
    }
  };

  const calculateAggregatedResults = (forms) => {
    const results = {};
    
    template?.questions.forEach(question => {
      const answers = forms.map(form => form.answers[question._id]);
      
      switch (question.type) {
        case 'number':
          const numbers = answers.map(Number).filter(n => !isNaN(n));
          results[question._id] = {
            average: numbers.reduce((a, b) => a + b, 0) / numbers.length || 0,
            min: Math.min(...numbers),
            max: Math.max(...numbers)
          };
          break;
        
        case 'text':
        case 'boolean':
          const frequency = answers.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
          }, {});
          results[question._id] = {
            mostCommon: Object.entries(frequency)
              .sort((a, b) => b[1] - a[1])[0]?.[0],
            frequency
          };
          break;
      }
    });

    setAggregatedResults(results);
  };

  const handleSave = async () => {
    try {
      await api.updateTemplate(id, {
        title,
        description,
        questions,
        accessType,
        allowedUsers
      });
      setIsEditing(false);
      fetchTemplateData();
    } catch (error) {
      setError('Failed to update template');
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { 
      text: '', 
      type: 'text', 
      isRequired: false 
    }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const renderGeneralSettings = () => (
    <div className="general-settings">
      {isEditing ? (
        <>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Access Type:</label>
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="specific">Specific Users</option>
            </select>
          </div>
          <button onClick={handleSave}>Save Changes</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{template?.title}</h2>
          <p>{template?.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );

  const renderQuestions = () => (
    <div className="questions-section">
      {isEditing ? (
        <>
          {questions.map((question, index) => (
            <div key={index} className="question-item">
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                placeholder="Question text"
              />
              <select
                value={question.type}
                onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Yes/No</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  checked={question.isRequired}
                  onChange={(e) => handleQuestionChange(index, 'isRequired', e.target.checked)}
                />
                Required
              </label>
            </div>
          ))}
          <button onClick={handleAddQuestion}>Add Question</button>
          <button onClick={handleSave}>Save Changes</button>
        </>
      ) : (
        <>
          {template?.questions.map((question, index) => (
            <div key={index} className="question-display">
              <h3>Question {index + 1}</h3>
              <p>{question.text}</p>
              <p>Type: {question.type}</p>
              <p>{question.isRequired ? 'Required' : 'Optional'}</p>
            </div>
          ))}
          <button onClick={() => setIsEditing(true)}>Edit Questions</button>
        </>
      )}
    </div>
  );

  const renderResults = () => (
    <div className="results-section">
      <h3>Submitted Forms ({forms.length})</h3>
      <table>
        <thead>
          <tr>
            <th>Submitted By</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {forms.map(form => (
            <tr key={form._id}>
              <td>{form.user.name}</td>
              <td>{new Date(form.submittedAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => navigate(`/form/${form._id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAggregation = () => (
    <div className="aggregation-section">
      {template?.questions.map((question, index) => (
        <div key={index} className="question-stats">
          <h3>{question.text}</h3>
          {question.type === 'number' ? (
            <div>
              <p>Average: {aggregatedResults[question._id]?.average.toFixed(2)}</p>
              <p>Min: {aggregatedResults[question._id]?.min}</p>
              <p>Max: {aggregatedResults[question._id]?.max}</p>
            </div>
          ) : (
            <div>
              <p>Most Common Answer: {aggregatedResults[question._id]?.mostCommon}</p>
              <h4>Response Distribution:</h4>
              {Object.entries(aggregatedResults[question._id]?.frequency || {}).map(([answer, count]) => (
                <p key={answer}>{answer}: {count} responses</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="template-details">
      {error && <div className="error-message">{error}</div>}
      
      <div className="tabs">
        <button 
          className={activeTab === 'general' ? 'active' : ''} 
          onClick={() => setActiveTab('general')}
        >
          General Settings
        </button>
        <button 
          className={activeTab === 'questions' ? 'active' : ''} 
          onClick={() => setActiveTab('questions')}
        >
          Questions
        </button>
        <button 
          className={activeTab === 'results' ? 'active' : ''} 
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
        <button 
          className={activeTab === 'aggregation' ? 'active' : ''} 
          onClick={() => setActiveTab('aggregation')}
        >
          Aggregation
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'questions' && renderQuestions()}
        {activeTab === 'results' && renderResults()}
        {activeTab === 'aggregation' && renderAggregation()}
      </div>
    </div>
  );
};

export default TemplateDetails;
