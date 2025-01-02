import { useState, useEffect } from 'react';
import api from '../services/api';
import { hasTemplateAccess } from '../utils/authUtils';
import { useAuth } from '../contexts/AuthContext';

export const useTemplate = (templateId) => {
  const [template, setTemplate] = useState(null);
  const [forms, setForms] = useState([]);
  const [aggregatedResults, setAggregatedResults] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const checkAccess = (template) => {
    return hasTemplateAccess(template, user);
  };

  const fetchTemplateData = async () => {
    try {
      const [templateRes, formsRes] = await Promise.all([
        api.getTemplateById(templateId),
        api.getTemplateSubmissions(templateId)
      ]);

      setTemplate(templateRes.data);
      setForms(formsRes.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch template data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAggregation = async () => {
    try {
      const response = await api.getTemplateAggregation(templateId);
      setAggregatedResults(response.data);
    } catch (error) {
      setError('Failed to fetch aggregation data');
    }
  };

  const updateTemplate = async (data) => {
    try {
      if (!checkAccess(template)) {
        throw new Error('Not authorized to update this template');
      }
      await api.updateTemplate(templateId, data);
      await fetchTemplateData();
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update template');
      return false;
    }
  };

  useEffect(() => {
    fetchTemplateData();
  }, [templateId]);

  return {
    template,
    forms,
    aggregatedResults,
    error,
    loading,
    fetchAggregation,
    updateTemplate,
    setTemplate,
    hasAccess: checkAccess(template)
  };
}; 