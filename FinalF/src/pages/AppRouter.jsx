import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import OrderDetail from './OrderDetail';
import GuestOrderDetail from './GuestOrderDetail';
import AdminDashboard from './AdminDashboard';
import NotFound from './NotFound';

export default function AppRouter(){
  return (
    <>
      <Header />
      <div className="container" style={{marginTop:16}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/guest-order/:id" element={<GuestOrderDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
