import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../../shared/FormField';
import QuestionList from '../QuestionList';
import { useTemplate } from '../../../hooks/useTemplate';
import api from '../../../services/api';

const EditTemplateForm = ({ templateId, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await api.getTemplateById(templateId);
        const template = response.data;
        setTitle(template.title);
        setDescription(template.description);
        setQuestions(template.questions);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch template');
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text', isRequired: false }]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
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
      const data = {
        title,
        description,
        questions: questions.map(q => ({
          ...q,
          text: q.text.trim()
        }))
      };

      if (templateId) {
        await api.updateTemplate(templateId, data);
      } else {
        await api.createTemplate(data);
      }
      
      navigate('/user');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cyber-gray rounded-xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
        Edit Template
      </h2>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-cyber-blue border border-cyber-purple rounded-lg p-3 
                     text-white focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                     focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-cyber-blue border border-cyber-purple rounded-lg p-3 
                     text-white focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                     focus:border-transparent transition-all duration-300 min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-cyber-purple">Questions</h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-cyber-blue hover:bg-opacity-80 px-4 py-2 rounded-lg 
                       transition-all duration-300 border border-cyber-purple"
            >
              Add Question
            </button>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="bg-cyber-blue/30 p-6 rounded-lg">
              <div className="flex justify-between mb-4">
                <h4 className="text-lg font-medium">Question {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                  className="text-cyber-pink hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                  placeholder="Enter question text"
                  className="w-full bg-cyber-black border border-cyber-purple rounded-lg p-3 
                           text-white focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                           focus:border-transparent transition-all duration-300"
                />

                <div className="flex items-center space-x-4">
                  <select
                    value={question.type}
                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                    className="bg-cyber-black border border-cyber-purple rounded-lg p-3 
                             text-white focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                             focus:border-transparent transition-all duration-300"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={question.isRequired}
                      onChange={(e) => handleQuestionChange(index, 'isRequired', e.target.checked)}
                      className="form-checkbox h-5 w-5 text-cyber-pink rounded border-cyber-purple 
                               focus:ring-cyber-pink focus:ring-offset-cyber-black"
                    />
                    <span className="text-gray-300">Required</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="bg-cyber-gray hover:bg-cyber-blue px-6 py-3 rounded-lg 
                     transition-all duration-300 border border-cyber-pink"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-cyber-purple hover:bg-opacity-80 px-8 py-3 rounded-lg 
                     transition-all duration-300 shadow-neon-hover"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTemplateForm; 