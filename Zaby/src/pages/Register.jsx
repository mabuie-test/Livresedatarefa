import React, { useState } from 'react';
import api from '../lib/api.js';
import { saveToken } from '../lib/auth.js';
import { Link } from 'react-router-dom';

export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  async function submit(e){
    e?.preventDefault();
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      saveToken(res.data.token);
      window.location.href = '/dashboard';
    } catch(err){ alert(err.response?.data?.error || err.message); }
  }
  return (
    <div className="container">
      <div style={{maxWidth:480,margin:'0 auto'}} className="card">
        <h3>Registar</h3>
        <form onSubmit={submit}>
          <div className="form-row"><label className="small">Nome</label><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
          <div className="form-row"><label className="small">Email</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div className="form-row"><label className="small">Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button className="btn" type="submit">Registar</button>
            <div className="small">Já tens conta? <Link to="/login" className="link">Entrar</Link></div>
          </div>
        </form>
      </div>
    </div>
  );
}
