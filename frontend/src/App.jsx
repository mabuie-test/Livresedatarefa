import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import OrderDetail from './pages/OrderDetail';
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

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
