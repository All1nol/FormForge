import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserPage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState([]);
  const [activeTab, setActiveTab] = useState('templates');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('Fetching user data...');
      
      const [templatesRes, formsRes] = await Promise.all([
        api.getUserTemplates(),
        api.getUserForms()
      ]);
      
      console.log('Templates response:', templatesRes);
      console.log('Forms response:', formsRes);
      
      setTemplates(templatesRes.data);
      setForms(formsRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  
  const handleDeleteTemplate = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await api.deleteTemplate(id);
        setTemplates(templates.filter(template => template._id !== id));
      } catch (error) {
        setError('Failed to delete template');
      }
    }
  };

  const handleEditTemplate = (id) => {
    navigate(`/template/${id}/edit`);
  };

  const handleTemplateClick = (templateId) => {
    navigate(`/template/${templateId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      <div className="tabs">
        <button 
          className={activeTab === 'templates' ? 'active' : ''} 
          onClick={() => setActiveTab('templates')}
        >
          My Templates ({templates.length})
        </button>
        <button 
          className={activeTab === 'forms' ? 'active' : ''} 
          onClick={() => setActiveTab('forms')}
        >
          My Filled Forms ({forms.length})
        </button>
      </div>

      {activeTab === 'templates' && (
        <div className="templates-section">
          <div className="actions">
            <button onClick={() => navigate('/template/new')} className="create-button">
              Create New Template
            </button>
          </div>
          {templates.length === 0 ? (
            <p>No templates created yet.</p>
          ) : (
            <table className="templates-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template._id}>
                    <td onClick={() => navigate(`/template/${template._id}`)}>
                      {template.title}
                    </td>
                    <td>{template.description}</td>
                    <td>{new Date(template.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEditTemplate(template._id)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteTemplate(template._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'forms' && (
        <div className="forms-section">
          <table className="forms-table">
            <thead>
              <tr>
                <th>Template</th>
                <th>Submitted Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form._id}>
                  <td>{form.template.title}</td>
                  <td>{new Date(form.submissionDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => navigate(`/form/${form._id}`)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserPage;
