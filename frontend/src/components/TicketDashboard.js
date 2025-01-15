import React, { useEffect, useState } from 'react';
import api from '../services/api';

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets'); 
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Your Tickets</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket._id}>
            <a href={ticket.link} target="_blank" rel="noopener noreferrer">{ticket.summary}</a> - {ticket.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketDashboard; 