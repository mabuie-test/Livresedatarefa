import axios from 'axios';
import { pushLog } from './errorLogger.js';

export const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const api = axios.create({ baseURL: API, timeout: 20000 });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
}, err => {
  pushLog({ type: 'request_error', message: err.message });
  return Promise.reject(err);
});

api.interceptors.response.use(r => r, err => {
  const cfg = err.config || {};
  pushLog({ type: 'response_error', url: cfg.url, method: cfg.method, status: err.response?.status, message: err.message });
  return Promise.reject(err);
});

export default api;
