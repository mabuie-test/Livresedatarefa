import React, { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import api from '../lib/api.js';
import { saveToken } from '../lib/auth.js';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handle(e){
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      saveToken(res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <Box maxW="480px" mx="auto" bg="white" p={6} borderRadius="md" boxShadow="sm">
      <Heading size="md" mb={4}>Registar — Livresedatarefa</Heading>
      <form onSubmit={handle}>
        <FormControl mb={2}><FormLabel>Nome</FormLabel><Input value={name} onChange={e=>setName(e.target.value)} /></FormControl>
        <FormControl mb={2}><FormLabel>Email</FormLabel><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} /></FormControl>
        <FormControl mb={4}><FormLabel>Password</FormLabel><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></FormControl>
        <Button colorScheme="purple" type="submit">Registar</Button>
      </form>
    </Box>
  );
}
