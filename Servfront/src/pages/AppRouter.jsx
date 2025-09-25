import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import OrderDetail from './OrderDetail';
import GuestOrderDetail from './GuestOrderDetail';
import AdminDashboard from './AdminDashboard';
import DebugLog from '../components/DebugLog';
import Footer from '../components/Hero';

export default function AppRouter(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/orders/:id" element={<OrderDetail/>} />
          <Route path="/orders/guest/:reference" element={<GuestOrderDetail/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/debug" element={<DebugLog/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
