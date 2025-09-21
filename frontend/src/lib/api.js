// frontend/src/lib/api.js
import axios from 'axios';
import { pushLog } from './errorLogger';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API,
  timeout: 20000
});

api.interceptors.request.use(cfg => {
  // opcional: registrar requests
  cfg.metadata = { startTime: Date.now() };
  return cfg;
}, err => {
  pushLog({ type: 'request_error', message: err.message, detail: err.toString() });
  return Promise.reject(err);
});

api.interceptors.response.use(resp => {
  // opcional: calcular tempo
  if (resp.config && resp.config.metadata) {
    resp.config.metadata.duration = Date.now() - resp.config.metadata.startTime;
  }
  return resp;
}, err => {
  const config = err.config || {};
  const status = err.response?.status;
  const data = err.response?.data;
  const url = config.url || 'unknown';
  const method = config.method || 'get';
  const duration = config.metadata ? (Date.now() - config.metadata.startTime) : undefined;

  // Push readable log
  pushLog({
    type: 'network_error',
    url,
    method,
    status,
    duration,
    message: err.message,
    response: data
  });

  return Promise.reject(err);
});

export default api;
export { API };
