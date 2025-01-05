import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [templates, setTemplates] = useState([]);
  const [popularTemplates, setPopularTemplates] = useState([]);
  const [isAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole] = useState(localStorage.getItem('userRole'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [templatesRes, popularRes] = await Promise.all([
          api.getTemplates(),
          api.getPopularTemplates()
        ]);
        
        // Sort templates by creation date (newest first)
        const sortedTemplates = templatesRes.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setTemplates(sortedTemplates);
        setPopularTemplates(popularRes.data);
      } catch (error) {
        setError('Failed to fetch templates');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTemplateClick = (templateId) => {
    if (isAuthenticated) {
      navigate(`/template/${templateId}`);
    } else {
      navigate('/login');
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await api.deleteTemplate(templateId);
      const templatesRes = await api.getTemplates();
      setTemplates(templatesRes.data);
    } catch (error) {
      console.error('Failed to delete template:', error);
      setError('Failed to delete template');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="min-h-screen bg-cyber-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
          Template Gallery
        </h1>

        <div className="space-y-6">
          {templates.map((template) => (
            <div 
              key={template._id}
              onClick={() => handleTemplateClick(template._id)}
              className="bg-cyber-gray/50 rounded-xl p-6 hover:bg-cyber-gray 
                       border border-cyber-purple/20 hover:border-cyber-purple/50
                       transition-all duration-300 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-cyber-pink group-hover:text-cyber-purple transition-colors mb-2">
                    {template.title}
                  </h3>
                  <p className="text-gray-400 max-w-2xl">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm border-t border-cyber-purple/20 pt-4 mt-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">
                    Created by <span className="text-cyber-purple">{template.user?.name || 'Anonymous'}</span>
                  </span>
                  <span className="text-gray-400">
                    Created {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="bg-cyber-purple/20 px-3 py-1 rounded-full text-cyber-purple text-xs">
                    {template.submissionCount || 0} submissions
                  </span>
                  {template.fields?.length && (
                    <span className="bg-cyber-pink/20 px-3 py-1 rounded-full text-cyber-pink text-xs">
                      {template.fields.length} fields
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="text-center py-12 bg-cyber-gray/30 rounded-xl border border-cyber-purple/20">
              <p className="text-gray-400 text-lg">
                No templates available yet.
              </p>
              {userRole && (
                <button
                  onClick={() => navigate('/templates/create')}
                  className="mt-4 bg-cyber-purple/20 hover:bg-cyber-purple/30 px-6 py-2 rounded-lg 
                           text-white border border-cyber-purple
                           transition-all duration-300 hover:shadow-neon"
                >
                  Create First Template
                </button>
              )}
            </div>
          )}
        </div>

        {/* Popular Templates Section */}
        <div className="mt-12 bg-cyber-gray/50 rounded-xl p-8 border border-cyber-purple/20">
          <h2 className="text-3xl font-bold mb-6 text-cyber-purple">
            Most Popular Templates
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-purple/20">
                  <th className="text-left py-4 px-6 text-gray-400">Template</th>
                  <th className="text-left py-4 px-6 text-gray-400">Created By</th>
                  <th className="text-left py-4 px-6 text-gray-400">Submissions</th>
                </tr>
              </thead>
              <tbody>
                {popularTemplates.map((template) => (
                  <tr 
                    key={template._id}
                    onClick={() => handleTemplateClick(template._id)}
                    className="border-b border-cyber-gray/30 hover:bg-cyber-blue/20 
                             transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <span className="text-cyber-pink hover:text-cyber-purple transition-colors">
                        {template.title}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {template.user?.name || 'Anonymous'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-cyber-purple/20 px-3 py-1 rounded-full text-cyber-purple text-xs">
                        {template.submissionCount || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
