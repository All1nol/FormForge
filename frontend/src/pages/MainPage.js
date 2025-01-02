import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TemplateCard from '../components/TemplateCard';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [templates, setTemplates] = useState([]);
  const [popularTemplates, setPopularTemplates] = useState([]);
  const [isAuthenticated] = useState(!!localStorage.getItem('token'));
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
        
        setTemplates(templatesRes.data);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="min-h-screen bg-cyber-black text-white p-8">
      <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
        Template Gallery
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {templates.map((template) => (
          <div 
            key={template._id}
            className="bg-cyber-gray rounded-xl p-6 hover:shadow-neon transition-all duration-300 cursor-pointer"
            onClick={() => handleTemplateClick(template._id)}
          >
            <h3 className="text-xl font-bold mb-3 text-cyber-pink">{template.title}</h3>
            <p className="text-gray-300 mb-4">{template.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>By {template.user?.name || 'Anonymous'}</span>
              <span>{template.submissionCount || 0} submissions</span>
            </div>
          </div>
        ))}
      </div>

      <section className="popular-templates bg-cyber-gray rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-cyber-purple">Most Popular Templates</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-cyber-purple">
              <tr>
                <th className="text-left py-4 px-6">Template</th>
                <th className="text-left py-4 px-6">Created By</th>
                <th className="text-left py-4 px-6">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {popularTemplates.map((template) => (
                <tr 
                  key={template._id}
                  onClick={() => handleTemplateClick(template._id)}
                  className="border-b border-cyber-gray/30 hover:bg-cyber-blue/30 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 text-cyber-pink">{template.title}</td>
                  <td className="py-4 px-6">{template.user?.name || 'Anonymous'}</td>
                  <td className="py-4 px-6">{template.submissionCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
