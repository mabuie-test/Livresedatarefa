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
import NotFound from '../components/NotFound.jsx';

export default function AppRouter(){
  return (
    <div style={{display:'flex', flexDirection:'column', minHeight:'100vh'}}>
      <Header />
      <main style={{flex:1}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/orders/guest/:reference" element={<GuestOrderDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
