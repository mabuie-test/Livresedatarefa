import React, { useState } from 'react';
import api from '../lib/api';
import { saveToken } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { email, password });
      saveToken(res.data.token);
      alert('Login ok');
      nav('/dashboard');
    } catch (err) {
      alert('Erro: ' + (err.response?.data?.error || err.message));
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Entrar — Livresedatarefa</h1>
      <form onSubmit={handleLogin}>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 block w-full border rounded px-3 py-2" />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-1 block w-full border rounded px-3 py-2" />
        </label>
        <button className="bg-brand text-white px-4 py-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
