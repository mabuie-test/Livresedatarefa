// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import api from '../lib/api';
import { saveToken, saveUser } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const token = res.data.token;
      const user = res.data.user || null; // backend deve enviar user object
      saveToken(token);
      if (user) saveUser(user);
      alert('Login bem sucedido');
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
          <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                 className="mt-1 block w-full border rounded px-3 py-2" required />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password"
                 className="mt-1 block w-full border rounded px-3 py-2" required />
        </label>
        <div className="flex items-center justify-between">
          <button className="bg-brand text-white px-4 py-2 rounded">Entrar</button>
          <a href="/register" className="text-sm text-gray-500 underline">Criar conta</a>
        </div>
      </form>
    </div>
  );
}
