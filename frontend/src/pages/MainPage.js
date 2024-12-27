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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="main-page">
      <h1>Gallery of Latest Templates</h1>
      <div className="template-gallery">
        {templates.map((template) => (
          <TemplateCard 
            key={template._id} 
            template={template} 
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      <section className="popular-templates">
        <h2>Most Popular Templates</h2>
        <table className="templates-table">
          <thead>
            <tr>
              <th>Template</th>
              <th>Created By</th>
              <th>Submissions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {popularTemplates.map((template) => (
              <tr key={template._id}>
                <td>{template.title}</td>
                <td>{template.user?.name || 'Anonymous'}</td>
                <td>{template.submissionCount || 0}</td>
                <td>
                  <button 
                    onClick={() => navigate(
                      isAuthenticated 
                        ? `/template/${template._id}/submit`
                        : '/login'
                    )}
                  >
                    {isAuthenticated ? 'Fill Out' : 'Login to Fill'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default MainPage;
