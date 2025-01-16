import React, { useEffect, useState } from 'react';
import api from '../services/api';

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/tickets?page=${page}`);
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [page]);

  return (
    <div className="bg-cyber-gray rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-cyber-pink">Your Tickets</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-cyber-purple">
            <tr>
              <th className="text-left py-4 px-6">Summary</th>
              <th className="text-left py-4 px-6">Priority</th>
              <th className="text-left py-4 px-6">Status</th>
              <th className="text-left py-4 px-6">Link</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket._id} className="border-b border-cyber-gray/30">
                <td className="py-4 px-6">{ticket.summary}</td>
                <td className="py-4 px-6">{ticket.priority}</td>
                <td className="py-4 px-6">{ticket.status}</td>
                <td className="py-4 px-6">
                  <a 
                    href={ticket.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyber-pink hover:text-cyber-purple"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketDashboard;