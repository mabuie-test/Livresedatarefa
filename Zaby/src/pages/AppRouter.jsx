import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Dashboard from './Dashboard.jsx';
import OrderDetail from './OrderDetail.jsx';
import GuestOrderDetail from './GuestOrderDetail.jsx';
import AdminDashboard from './AdminDashboard.jsx';

export default function AppRouter(){
  return (
    <div style={{minHeight:'100%'}}>
      <Header />
      <main className="container" style={{marginTop:12}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/orders/guest/:reference" element={<GuestOrderDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
