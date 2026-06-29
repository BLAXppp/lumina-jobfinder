import axios from 'axios';

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export const jobService = {
  getAll: (params?: any) => api.get('/jobs', { params }),
  apply: (jobId: string) => api.post(`/jobs/${jobId}/apply`),
};

export const companyService = {
  getAll: () => api.get('/companies'),
};

export const emailService = {
  sendBulk: (data: any) => api.post('/emails/bulk', data),
  getHistory: () => api.get('/emails/history'),
};