import React from 'react';

const FormField = ({ label, error, children, required }) => {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {children}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default FormField; 