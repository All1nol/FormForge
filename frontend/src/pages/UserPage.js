import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import DeleteTemplateModal from '../components/template/DeleteTemplateModal.js';

const UserPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState([]);
  const [activeTab, setActiveTab] = useState('templates');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleDeleteClick = (template) => {
    setTemplateToDelete(template);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await api.deleteTemplate(templateToDelete._id);
      
      // Update templates list
      setTemplates(templates.filter(t => t._id !== templateToDelete._id));
      
      // Close modal
      setDeleteModalOpen(false);
      setTemplateToDelete(null);
    } catch (error) {
      console.error('Failed to delete template:', error);
      // You might want to show an error message here
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyber-pink to-cyber-purple bg-clip-text text-transparent">
        {user.role === 'admin' ? 'All Templates' : 'My Templates'}
      </h1>
      
      <div className="flex gap-4 mb-8">
        <button 
          className={`px-6 py-3 rounded-lg transition-all duration-300 ${
            activeTab === 'templates' 
              ? 'bg-cyber-pink text-white shadow-neon' 
              : 'bg-cyber-gray hover:bg-cyber-blue'
          }`}
          onClick={() => setActiveTab('templates')}
        >
          My Templates ({templates.length})
        </button>
        <button 
          className={`px-6 py-3 rounded-lg transition-all duration-300 ${
            activeTab === 'forms' 
              ? 'bg-cyber-pink text-white shadow-neon' 
              : 'bg-cyber-gray hover:bg-cyber-blue'
          }`}
          onClick={() => setActiveTab('forms')}
        >
          My Filled Forms ({forms.length})
        </button>
      </div>

      {activeTab === 'templates' && (
        <div className="bg-cyber-gray rounded-xl p-6 shadow-lg">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/template/new')} 
              className="bg-cyber-purple hover:bg-opacity-80 px-6 py-3 rounded-lg transition-all duration-300 shadow-neon-hover"
            >
              Create New Template
            </button>
          </div>
          
          {templates.length === 0 ? (
            <p className="text-gray-400">No templates created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-cyber-purple">
                  <tr>
                    <th className="text-left py-4 px-6">Title</th>
                    <th className="text-left py-4 px-6">Description</th>
                    <th className="text-left py-4 px-6">Created At</th>
                    <th className="text-left py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <tr 
                      key={template._id} 
                      className="border-b border-cyber-gray hover:bg-cyber-blue/30 transition-colors"
                    >
                      <td 
                        className="py-4 px-6 cursor-pointer hover:text-cyber-pink"
                        onClick={() => navigate(`/template/${template._id}`)}
                      >
                        {template.title}
                      </td>
                      <td className="py-4 px-6">{template.description}</td>
                      <td className="py-4 px-6">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditTemplate(template._id)}
                            className="bg-cyber-purple px-4 py-2 rounded hover:shadow-neon transition-all"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(template)}
                            className="bg-cyber-pink px-4 py-2 rounded hover:shadow-neon transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                    <button onClick={() => navigate(`/forms/${form._id}/view`)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteTemplateModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTemplateToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
};

export default UserPage;
