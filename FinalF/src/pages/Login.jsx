import React, {useState} from 'react';
import api from '../lib/api';
import { saveToken } from '../lib/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      saveToken(res.data.token);
      nav('/dashboard');
    } catch(err){
      alert(err?.response?.data?.error || 'Erro login');
    }
  }

  return (
    <div className="card">
      <h2>Entrar</h2>
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn" type="submit">Entrar</button>
      </form>

      <div style={{marginTop:12, fontSize:14}}>
        <span>Não tens conta? </span>
        <Link to="/register" style={{fontWeight:700}}>Regista-te</Link>
      </div>
    </div>
  );
}
