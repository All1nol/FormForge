import React, { useEffect, useState } from 'react';
import { fetchTemplates } from '../services/templateService';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const getTemplates = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchTemplates(token);
        setTemplates(data);
      } catch (err) {
        console.error(err);
      }
    };

    getTemplates();
  }, []);

  return (
    <div>
      <h2>Templates</h2>
      <ul>
        {templates.map((template) => (
          <li key={template._id}>
            {template.title} - {template.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplateList;
