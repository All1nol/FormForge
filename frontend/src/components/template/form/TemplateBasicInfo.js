import React from 'react';
import FormField from '../../shared/FormField';

const TemplateBasicInfo = ({ title, description, onTitleChange, onDescriptionChange }) => {
  return (
    <div className="basic-info-section">
      <FormField label="Title" required>
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          className="form-input"
          required
        />
      </FormField>
      
      <FormField label="Description" required>
        <textarea
          value={description}
          onChange={onDescriptionChange}
          className="form-textarea"
          required
        />
      </FormField>
    </div>
  );
};

export default TemplateBasicInfo; 