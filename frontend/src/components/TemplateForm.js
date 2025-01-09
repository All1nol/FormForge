import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
  //too much fucntions in templatForm
const TemplateForm = () => {
  const navigate = useNavigate(); // user should be navigated where? mainPage|| response|| template 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', type: 'text', isRequired: false }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // loading shouldn't be here

  const handleAddQuestion = () => { // add new question to the form
    setQuestions([...questions, { text: '', type: 'text', isRequired: false }]);
  };

  const handleQuestionChange = (index, field, value) => {//handle changes in question
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => { //remove
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {  // validation error handle could be somewhere else not here
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
    <div className="min-h-screen bg-cyber-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
          Create New Template
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-cyber-gray/50 rounded-xl p-8 border border-cyber-purple/20">
          <div className="space-y-4">
            <label className="block text-lg font-medium text-cyber-pink">
              Template Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-cyber-black border border-cyber-purple rounded-lg p-3 
                       focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                       focus:border-transparent transition-all duration-300"
              placeholder="Enter template title"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-medium text-cyber-pink">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-cyber-black border border-cyber-purple rounded-lg p-3 
                       focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                       focus:border-transparent transition-all duration-300 min-h-[100px]"
              placeholder="Describe your template"
              required
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-cyber-purple">Questions</h2>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-cyber-purple/20 hover:bg-cyber-purple/30 px-4 py-2 rounded-lg 
                         text-white border border-cyber-purple
                         transition-all duration-300 hover:shadow-neon"
              >
                Add Question
              </button>
            </div>

            {questions.map((question, index) => (
              <div 
                key={index}
                className="bg-cyber-black/50 rounded-lg p-6 border border-cyber-purple/30 space-y-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <input
                    type="text"
                    placeholder="Question text"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                    className="flex-1 bg-cyber-black border border-cyber-purple rounded-lg p-3 
                             focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                             focus:border-transparent transition-all duration-300"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveQuestion(index)}
                    disabled={questions.length === 1}
                    className="bg-red-500/20 hover:bg-red-500/30 px-3 py-2 rounded-lg 
                             text-red-400 border border-red-500
                             transition-all duration-300 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <select
                    value={question.type}
                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                    className="bg-cyber-black border border-cyber-purple rounded-lg p-3 
                             focus:outline-none focus:ring-2 focus:ring-cyber-pink 
                             focus:border-transparent transition-all duration-300"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="boolean">Yes/No</option>
                  </select>

                  <label className="flex items-center space-x-2 text-gray-400">
                    <input
                      type="checkbox"
                      checked={question.isRequired}
                      onChange={(e) => handleQuestionChange(index, 'isRequired', e.target.checked)}
                      className="form-checkbox h-5 w-5 text-cyber-pink rounded border-cyber-purple 
                               focus:ring-cyber-pink focus:ring-offset-cyber-black"
                    />
                    <span>Required field</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-6 border-t border-cyber-purple/20">
            <button
              type="submit"
              disabled={loading}
              className="bg-cyber-purple hover:bg-opacity-80 px-6 py-3 rounded-lg 
                       transition-all duration-300 shadow-neon-hover disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Template'}
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

export default TemplateForm;
