import axios from 'axios';

export const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const api = axios.create({
  baseURL: API,
  timeout: 20000
});

// attach token if present
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
}, err => Promise.reject(err));

export default api;
