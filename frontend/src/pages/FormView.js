import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const FormView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await api.getFormById(id);
        setForm(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch form');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!form) return <div>Form not found</div>;

  return (
    <div className="min-h-screen bg-cyber-black text-white p-8">
      <div className="max-w-4xl mx-auto bg-cyber-gray rounded-xl p-8 shadow-lg">
        <div className="border-b border-cyber-purple pb-6 mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
            {form.template.title}
          </h2>
          <p className="text-gray-400">
            Submitted on: {new Date(form.submittedAt).toLocaleString()}
          </p>
        </div>

        <div className="space-y-8">
          {form.template.questions.map((question) => (
            <div key={question._id} className="bg-cyber-blue/30 rounded-lg p-6">
              <h4 className="text-lg font-medium mb-3 text-cyber-pink">{question.text}</h4>
              <p className="text-gray-300 bg-cyber-black/50 p-4 rounded-lg">
                {form.answers[question._id] || 'No answer provided'}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => navigate('/user')}
            className="bg-cyber-purple hover:bg-opacity-80 px-6 py-3 rounded-lg transition-all duration-300 shadow-neon-hover"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormView; 