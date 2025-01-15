import React, { useState } from 'react';
import api from '../services/api'; // Adjust the path as necessary

const CreateTicket = () => {
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('Low');
  const [templateTitle, setTemplateTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createTicket({
        summary,
        priority,
        templateTitle
      });
      setMessage(`Ticket created: ${response.data.key}`);
    } catch (error) {
      setMessage(`Error creating ticket: ${error.response?.data?.message || error.message}`);
      console.error('Ticket creation error:', error);
    }
  };

  return (
    <div>
      <h2>Create Support Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="text"
          placeholder="Template Title"
          value={templateTitle}
          onChange={(e) => setTemplateTitle(e.target.value)}
        />
        <button type="submit">Create Ticket</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateTicket;