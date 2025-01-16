import React, { useEffect, useState } from 'react';
import api from '../services/api';

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.getTickets(page, ITEMS_PER_PAGE);
        setTickets(response.data.tickets);
        setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [page]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-cyber-pink">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
        My Support Tickets
      </h2>

      <div className="bg-cyber-gray rounded-xl p-6 shadow-lg border border-cyber-purple/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-cyber-purple">
              <tr>
                <th className="text-left py-4 px-6">Summary</th>
                <th className="text-left py-4 px-6">Priority</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Created At</th>
                <th className="text-left py-4 px-6">Jira Link</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id} className="border-b border-cyber-gray/30 hover:bg-cyber-blue/30 transition-colors">
                  <td className="py-4 px-6">{ticket.summary}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      ticket.priority === 'High' 
                        ? 'bg-cyber-pink/20 text-cyber-pink' 
                        : ticket.priority === 'Medium'
                        ? 'bg-cyber-purple/20 text-cyber-purple'
                        : 'bg-cyber-blue/20 text-cyber-blue'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">{ticket.status}</td>
                  <td className="py-4 px-6">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <a 
                      href={`${process.env.REACT_APP_JIRA_URL}/browse/${ticket.key}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyber-pink hover:text-cyber-purple transition-colors"
                    >
                      {ticket.key}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No tickets created yet
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  page === i + 1
                    ? 'bg-cyber-pink text-white'
                    : 'bg-cyber-gray hover:bg-cyber-blue/20'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDashboard;