import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { getToken, logout, getUserFromToken } from '../lib/auth.js';

export default function Header(){
  const [open, setOpen] = useState(false);
  const token = getToken();
  const user = getUserFromToken();
  const navigate = useNavigate();

  function handleLogout(){
    logout();
    navigate('/');
  }

  return (
    <header className="header container" role="banner" aria-label="Cabeçalho">
      <div className="brand">
        <img src={logo} alt="logo" style={{width:44,height:44,borderRadius:8}}/>
        <div>
          <div className="header-title">Livresedatarefa</div>
          <div className="header-sub">Trabalhos com liberdade • Pesquisa com rigor</div>
        </div>
      </div>

      <button className="mobile-toggle" aria-label="Abrir menu" onClick={()=>setOpen(v=>!v)}>☰</button>

      <nav className="nav" style={{display: open ? 'flex' : undefined}}>
        <Link to="/">Início</Link>
        <Link to="/dashboard">Minha Conta</Link>

        { token && user?.role === 'admin' ? (
          <Link to="/admin">Admin</Link>
        ) : null }

        <Link to="/debug">Debug</Link>

        { token ? (
          <>
            <button className="btn" onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{textDecoration:'none'}}><button className="btn">Entrar</button></Link>
            <Link to="/register" style={{textDecoration:'none'}}><button className="btn ghost">Registar</button></Link>
          </>
        ) }
      </nav>
    </header>
  );
}
