import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Dashboard from './Dashboard.jsx';
import OrderDetail from './OrderDetail.jsx';
import GuestOrderDetail from './GuestOrderDetail.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import DebugLog from '../components/DebugLog.jsx';
import Hero from '../components/Hero.jsx';
import { Box } from '@chakra-ui/react';

export default function AppRouter(){
  return (
    <Box minH="100vh" display="flex" flexDir="column">
      <Header />
      <Box as="main" flex="1" maxW="1200px" mx="auto" px={4} py={6}>
        <Routes>
          <Route path="/" element={<><Hero /><Home /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/orders/guest/:reference" element={<GuestOrderDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/debug" element={<DebugLog />} />
        </Routes>
      </Box>
    </Box>
  );
}
