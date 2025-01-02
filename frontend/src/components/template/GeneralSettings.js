import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const GeneralSettings = ({ template, formsCount, isAuthorOrAdmin }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      await api.submitTemplateForm(template._id, { answers });
      navigate('/user');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question) => {
    const baseInputClass = `
      w-full bg-cyber-black border-2 border-cyber-purple rounded-lg p-3 
      focus:outline-none focus:ring-2 focus:ring-cyber-pink focus:border-transparent 
      transition-all duration-300 text-white placeholder-gray-500
      ${question.isRequired ? 'border-cyber-pink' : 'border-cyber-purple'}
    `;

    const selectClass = `
      ${baseInputClass}
      appearance-none bg-right bg-no-repeat
      pr-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSA3LjVMMTAgMTIuNUwxNSA3LjUiIHN0cm9rZT0iI2ZmMDBmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')]
    `;

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            required={question.isRequired}
            className={baseInputClass}
            placeholder="Enter your answer..."
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            required={question.isRequired}
            className={baseInputClass}
            placeholder="Enter your answer..."
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            required={question.isRequired}
            className={baseInputClass}
            placeholder="Enter your answer..."
          />
        );
      case 'boolean':
        return (
          <select
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            required={question.isRequired}
            className={selectClass}
          >
            <option value="">Select...</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-cyber-gray rounded-xl p-8 shadow-lg border-2 border-cyber-purple/30">
      <div className="mb-8 space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
          {template.title}
        </h2>
        <p className="text-gray-300">{template.description}</p>
        
        {isAuthorOrAdmin && (
          <div className="grid grid-cols-3 gap-4 bg-cyber-blue/20 p-6 rounded-lg border border-cyber-purple/50">
            <div>
              <p className="text-cyber-pink font-medium">Created</p>
              <p className="text-gray-300">{new Date(template.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-cyber-pink font-medium">Total Submissions</p>
              <p className="text-gray-300">{formsCount}</p>
            </div>
            <div>
              <p className="text-cyber-pink font-medium">Questions</p>
              <p className="text-gray-300">{template.questions.length}</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg border border-red-500/50 animate-pulse">
            {error}
          </div>
        )}
        
        {template.questions.map((question) => (
          <div key={question._id} className="bg-cyber-blue/30 p-6 rounded-lg">
            <label className="block mb-3 text-lg font-medium">
              {question.text}
              {question.isRequired && (
                <span className="text-cyber-pink ml-1">*</span>
              )}
            </label>
            {renderQuestion(question)}
          </div>
        ))}

        <div className="flex justify-end mt-8">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-cyber-purple hover:bg-opacity-80 px-8 py-3 rounded-lg 
                     transition-all duration-300 shadow-neon-hover disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings; 