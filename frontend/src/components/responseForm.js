import React, { useState } from 'react';
import API from '../api';

const ResponseForm = ({ templateId }) => {
  const [answers, setAnswers] = useState([]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].answer = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/responses', { templateId, answers });
      alert('Response submitted successfully!');
    } catch (error) {
      console.error('Error submitting response:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Submit Response</h2>
      <form onSubmit={handleSubmit}>
        {answers.map((answer, index) => (
          <div key={index}>
            <label>{answer.questionLabel}</label>
            <input
              value={answer.answer || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ResponseForm;
