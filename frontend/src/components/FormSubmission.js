import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const FormSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await api.getTemplateById(id);
      setTemplate(response.data);
      
      // Initialize answers object
      const initialAnswers = {};
      response.data.questions.forEach(question => {
        initialAnswers[question._id] = '';
      });
      setAnswers(initialAnswers);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch template');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.submitTemplateForm(id, { answers });
      navigate('/user');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            required={question.isRequired}
            className="form-control"
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            required={question.isRequired}
            className="form-control"
          />
        );
      
      case 'boolean':
        return (
          <select
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            required={question.isRequired}
            className="form-control"
          >
            <option value="">Select...</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            required={question.isRequired}
            className="form-control"
          />
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="form-submission">
      <h2>{template.title}</h2>
      <p className="description">{template.description}</p>
      
      <form onSubmit={handleSubmit}>
        {template.questions.map((question, index) => (
          <div key={question._id} className="question-container">
            <label>
              {question.text}
              {question.isRequired && <span className="required">*</span>}
            </label>
            {renderQuestion(question)}
          </div>
        ))}
        
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormSubmission; 