import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TemplateForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', type: 'text', isRequired: false }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text', isRequired: false }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!questions.every(q => q.text.trim())) {
      setError('All questions must have text');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.createTemplate({ 
        title, 
        description, 
        questions: questions.map(q => ({
          ...q,
          text: q.text.trim()
        }))
      });
      
      if (response.data) {
        navigate(`/template/${response.data._id}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="template-form">
      <h2>Create Template</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="questions-section">
          <h3>Questions</h3>
          {questions.map((question, index) => (
            <div key={index} className="question-item">
              <input
                type="text"
                placeholder="Question text"
                value={question.text}
                onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                required
              />
              <select
                value={question.type}
                onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
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
              <button 
                type="button" 
                onClick={() => handleRemoveQuestion(index)}
                disabled={questions.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddQuestion}>
            Add Question
          </button>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Template'}
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateForm;
