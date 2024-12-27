import React from 'react';
import { useNavigate } from 'react-router-dom';

const TemplateCard = ({ template, isAuthenticated }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate(`/template/${template._id}/submit`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="template-card">
      <h3>{template.title}</h3>
      <p>{template.description}</p>
      <div className="template-meta">
        <span>Questions: {template.questions?.length || 0}</span>
        <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
        <span>By: {template.user?.name || 'Anonymous'}</span>
      </div>
      <button onClick={handleClick}>
        {isAuthenticated ? 'Fill Out Form' : 'Login to Fill'}
      </button>
    </div>
  );
};

export default TemplateCard;
