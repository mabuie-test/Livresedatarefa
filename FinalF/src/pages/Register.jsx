import React, {useState} from 'react';
import api from '../lib/api';
import { saveToken } from '../lib/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      saveToken(res.data.token);
      nav('/dashboard');
    } catch(err){
      alert(err?.response?.data?.error || 'Erro registo');
    }
  }

  return (
    <div className="card">
      <h2>Registar</h2>
      <form onSubmit={submit}>
        <div className="form-row"><label>Nome</label><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="form-row"><label>Email</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="form-row"><label>Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button className="btn" type="submit">Registar</button>
      </form>

      <div style={{marginTop:12, fontSize:14}}>
        <span>Já tens conta? </span>
        <Link to="/login" style={{fontWeight:700}}>Entrar</Link>
      </div>
    </div>
  );
}
