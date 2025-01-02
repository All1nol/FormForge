import { useState, useCallback } from 'react';

export const useFormValidation = (validationRules) => {
  const [errors, setErrors] = useState({});

  const validate = useCallback((data) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const value = data[field];
      const rules = validationRules[field];

      if (rules.required && !value?.trim()) {
        newErrors[field] = `${field} is required`;
      }

      if (rules.minLength && value?.length < rules.minLength) {
        newErrors[field] = `${field} must be at least ${rules.minLength} characters`;
      }

      if (rules.custom) {
        const customError = rules.custom(value, data);
        if (customError) {
          newErrors[field] = customError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationRules]);

  return { errors, validate, setErrors };
};