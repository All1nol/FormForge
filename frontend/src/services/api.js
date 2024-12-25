import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Always attach token if it exists, except for login and register
    if (token && !config.url.includes('/login') && !config.url.includes('/register')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define the API object
const apiObject = {
  // Auth endpoints
  login: (data) => api.post('/users/login', data),
  register: (data) => api.post('/users/register', data),
  
  // Templates endpoints
  getTemplates: () => api.get('/templates'),
  getTemplateById: (id) => api.get(`/templates/${id}`),
  getPopularTemplates: () => api.get('/templates/popular'),
  createTemplate: (data) => api.post('/templates', data),
  updateTemplate: (id, data) => api.put(`/templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/templates/${id}`),
  addCommentToTemplate: (id, comment) => api.post(`/templates/${id}/comments`, { text: comment }),
  
  // User and Admin endpoints
  getUserTemplates: () => api.get('/users/templates'),
  getUserForms: () => api.get('/users/forms'),
  getUsers: () => api.get('/users/all'),
  blockUser: (userId) => api.patch(`/users/${userId}/block`),
  unblockUser: (userId) => api.patch(`/users/${userId}/unblock`),
  logout: () => api.post('/users/logout'),
};

export default apiObject;
