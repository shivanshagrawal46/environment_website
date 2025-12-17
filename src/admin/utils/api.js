import axios from 'axios';

const API_URL = 'https://www.pcbfoundation.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Blogs API
export const blogsAPI = {
  getAll: (status = 'all') => api.get(`/blogs?status=${status}`),
  getOne: (id) => api.get(`/blogs/${id}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
};

// Projects API
export const projectsAPI = {
  getAll: (params = {}) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Team API
export const teamAPI = {
  getAll: () => api.get('/team'),
  create: (data) => api.post('/team', data),
  update: (id, data) => api.put(`/team/${id}`, data),
  delete: (id) => api.delete(`/team/${id}`),
};

// Stats API
export const statsAPI = {
  getAll: () => api.get('/stats'),
  createOrUpdate: (data) => api.post('/stats', data),
  update: (id, data) => api.put(`/stats/${id}`, data),
};

// Contacts API
export const contactsAPI = {
  getAll: () => api.get('/contacts'),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
};

// About API
export const aboutAPI = {
  get: () => api.get('/about'),
  update: (data) => api.put('/about', data),
};

// Media API
export const mediaAPI = {
  getAll: (params = {}) => api.get('/media', { params }),
  getOne: (id) => api.get(`/media/${id}`),
  upload: (formData) => api.post('/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/media/${id}`, data),
  delete: (id) => api.delete(`/media/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: (params = {}) => api.get('/categories', { params }),
  getOne: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Tags API
export const tagsAPI = {
  getAll: (params = {}) => api.get('/tags', { params }),
  getOne: (id) => api.get(`/tags/${id}`),
  create: (data) => api.post('/tags', data),
  update: (id, data) => api.put(`/tags/${id}`, data),
  delete: (id) => api.delete(`/tags/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Auth API
export const authAPI = {
  changePassword: (data) => api.post('/auth/change-password', data),
};

export default api;

