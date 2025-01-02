import api from './api';

export const templateService = {
  create: async (templateData) => {
    const response = await api.post('/templates', templateData);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  update: async (id, updateData) => {
    const response = await api.put(`/templates/${id}`, updateData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/templates/${id}`);
  },

  getSubmissions: async (id) => {
    const response = await api.get(`/templates/${id}/submissions`);
    return response.data;
  },

  submitForm: async (id, formData) => {
    const response = await api.post(`/templates/${id}/submit`, formData);
    return response.data;
  }
}; 