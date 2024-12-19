import { useState, useEffect } from 'react';
import api from '../services/api';

const UserPage = () => {
  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState([]);
  const [activeTab, setActiveTab] = useState('templates'); // Tabs: templates/forms

  useEffect(() => {
    const fetchUserData = async () => {
      const userTemplates = await api.getUserTemplates();
      const userForms = await api.getUserForms();
      setTemplates(userTemplates.data);
      setForms(userForms.data);
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('templates')}>My Templates</button>
        <button onClick={() => setActiveTab('forms')}>My Filled Forms</button>
      </div>
      {activeTab === 'templates' && (
        <div>
          <h2>My Templates</h2>
          <div style={{ marginBottom: '1rem' }}>
            <a href="/template/new" className="button">Create New Template</a>
          </div>
          <ul>
            {templates.map((template) => (
              <li key={template._id}>
                {template.title}
                <button>Edit</button>
                <button>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === 'forms' && (
        <div>
          <h2>My Filled Forms</h2>
          <ul>
            {forms.map((form) => (
              <li key={form._id}>
                {form.name}
                <button>Edit</button>
                <button>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserPage;
