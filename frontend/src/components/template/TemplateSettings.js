import React, { useState } from 'react';
import api from '../../services/api';

const TemplateSettings = ({ template, onUpdate }) => {
  const [accessType, setAccessType] = useState(template.accessType || 'all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedTemplate = await api.updateTemplate(template._id, {
        accessType
      });
      onUpdate(updatedTemplate);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cyber-gray rounded-xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-cyber-pink">
        Template Settings
      </h3>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Access Type</label>
          <select
            value={accessType}
            onChange={(e) => setAccessType(e.target.value)}
            className="w-full bg-cyber-blue border border-cyber-purple rounded-lg p-3 
                     focus:outline-none focus:ring-2 focus:ring-cyber-pink"
          >
            <option value="all">Public</option>
            <option value="private">Private</option>
            <option value="selected">Selected Users Only</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-cyber-purple hover:bg-opacity-80 px-8 py-3 rounded-lg 
                   transition-all duration-300 shadow-neon-hover disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default TemplateSettings; 