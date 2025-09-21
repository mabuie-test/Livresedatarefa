import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
// frontend/src/main.jsx (adicione abaixo das imports)
import { pushLog } from './lib/errorLogger';

// global error handlers
window.addEventListener('error', (ev) => {
  try {
    pushLog({ type: 'uncaught_error', message: ev.message, filename: ev.filename, lineno: ev.lineno, colno: ev.colno });
  } catch (e) {}
});

window.addEventListener('unhandledrejection', (ev) => {
  try {
    const reason = ev.reason;
    pushLog({ type: 'unhandled_rejection', message: reason?.message || String(reason), detail: reason });
  } catch (e) {}
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
