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
    <div className="form-view">
      <h2>{form.template.title}</h2>
      <p>Submitted on: {new Date(form.submittedAt).toLocaleString()}</p>
      
      <div className="answers-container">
        {form.template.questions.map((question, index) => (
          <div key={index} className="answer-item">
            <h3>{question.text}</h3>
            <p className="answer">
              {form.answers[question._id]?.toString() || 'No answer provided'}
            </p>
          </div>
        ))}
      </div>

      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
    </div>
  );
};

export default FormView; 