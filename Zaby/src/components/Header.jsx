import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Header(){
  const [open, setOpen] = useState(false);

  return (
    <header className="header container" role="banner" aria-label="Cabeçalho principal">
      <div className="brand" style={{alignItems:'center'}}>
        <img src={logo} alt="Livresedatarefa" style={{width:44,height:44,borderRadius:8,background:'#fff'}}/>
        <div>
          <div className="header-title">Livresedatarefa</div>
          <div className="header-sub">Trabalhos com liberdade • Pesquisa com rigor</div>
        </div>
      </div>

      <button className="mobile-toggle" aria-label="Abrir menu" onClick={()=>setOpen(v=>!v)}>
        ☰
      </button>

      <nav className="nav" style={{display: open ? 'flex' : undefined}}>
        <Link to="/">Início</Link>
        <Link to="/dashboard">Minha Conta</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/debug">Debug</Link>
        <Link to="/login" style={{textDecoration:'none'}}><button className="btn">Entrar</button></Link>
        <Link to="/register" style={{textDecoration:'none'}}><button className="btn ghost" aria-label="Registar">Registar</button></Link>
      </nav>
    </header>
  );
}
