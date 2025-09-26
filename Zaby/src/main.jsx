import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './pages/AppRouter.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="app-root">
        <AppRouter />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
