import React from 'react';

const TemplateCard = ({ template }) => {
  return (
    <div className="template-card">
      <h3>{template.title}</h3>
      <p>{template.description}</p>
      <p>Created by: {template.createdBy.name}</p>
    </div>
  );
};

export default TemplateCard;
