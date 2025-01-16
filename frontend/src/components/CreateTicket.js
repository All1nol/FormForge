import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const CreateTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('Low');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const templateInfo = location.state?.template || {
    title: location.pathname.includes('template') ? 
      document.title.split(' - ')[0] : 
      'N/A'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.createTicket({
        summary,
        priority,
        templateTitle: templateInfo.title, 
        link: window.location.href 
      });
      setMessage(`Ticket created: ${response.data.key}`);
      setTimeout(() => {
        navigate('/tickets');
      }, 2000);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-cyber-gray p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-cyber-pink">Create Support Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Summary</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-2 rounded bg-cyber-blue/20 border border-cyber-purple"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Priority</label>
          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 rounded bg-cyber-blue/20 border border-cyber-purple"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button 
          type="submit"
          className="w-full bg-cyber-pink py-2 rounded hover:bg-opacity-80 transition-all"
        >
          {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
      {message && (
        <div className="mt-4 p-4 rounded bg-cyber-blue/20">
          {message}
        </div>
      )}
    </div>
  );
};

export default CreateTicket;