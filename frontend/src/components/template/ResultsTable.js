import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResultsTable = ({ forms }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-cyber-gray rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-6 text-cyber-purple">
        Submitted Forms ({forms.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-cyber-purple">
            <tr>
              <th className="text-left py-4 px-6">Submitted By</th>
              <th className="text-left py-4 px-6">Date</th>
              <th className="text-left py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr 
                key={form._id}
                className="border-b border-cyber-gray/30 hover:bg-cyber-blue/30 transition-colors"
              >
                <td className="py-4 px-6">{form.user?.name || 'Anonymous'}</td>
                <td className="py-4 px-6">
                  {new Date(form.submittedAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => navigate(`/forms/${form._id}/view`)}
                    className="bg-cyber-purple px-4 py-2 rounded hover:shadow-neon transition-all"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable; 