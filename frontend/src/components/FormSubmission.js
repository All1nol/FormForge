import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const FormSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // again this can be done in somewhere else 

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => { // shouldn't be here, we can put this function seperate 
    try {
      setLoading(true);
      const response = await api.getTemplateById(id);
      setTemplate(response.data);
      
      // Initialize answers object
      const initialAnswers = {};
      response.data.questions.forEach(question => {
        initialAnswers[question._id] = '';
      });
      setAnswers(initialAnswers); // initialize the answers state
      
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
      
      // Filter out empty answers
      const nonEmptyAnswers = {};
      template.questions.forEach(question => {
        const answer = answers[question._id];
        if (answer && String(answer).trim() !== '') {
          nonEmptyAnswers[question._id] = answer;
        }
      });
      
      if (Object.keys(nonEmptyAnswers).length === 0) {
        setError('Please fill in at least one answer');
        return;
      }

      console.log('Submitting answers:', nonEmptyAnswers);
      const response = await api.submitTemplateForm(id, { answers: nonEmptyAnswers });
      console.log('Response:', response);
      navigate('/user');
    } catch (error) {
      console.error('Submission error:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-cyber-black text-white p-8">
      <div className="max-w-3xl mx-auto bg-cyber-gray rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
          {template.title}
        </h2>
        <p className="text-gray-300 mb-8">{template.description}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {template.questions.map((question) => (
            <div key={question._id} className="question-container">
              <label className="block mb-2 text-lg font-medium">
                {question.text}
                {question.isRequired && (
                  <span className="text-cyber-pink ml-1">*</span>
                )}
              </label>
              <input
                type="text"
                value={answers[question._id] || ''}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                required={question.isRequired}
                className="w-full bg-cyber-blue border border-cyber-purple rounded-lg p-3 
                         focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                         focus:border-transparent transition-all duration-300"
              />
            </div>
          ))}
          
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-cyber-purple hover:bg-opacity-80 px-6 py-3 rounded-lg 
                       transition-all duration-300 shadow-neon-hover disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-cyber-gray hover:bg-cyber-blue px-6 py-3 rounded-lg 
                       transition-all duration-300 border border-cyber-pink"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormSubmission; 