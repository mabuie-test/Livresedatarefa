import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Header(){
  return (
    <header className="header container" style={{display:'flex',alignItems:'center',gap:12}}>
      <div className="brand">
        <img src={logo} alt="logo" style={{width:44,height:44}}/>
        <div>
          <div style={{fontWeight:700}}>Livresedatarefa</div>
          <div style={{fontSize:12,color:'#EDE9FE'}}>Trabalhos com liberdade</div>
        </div>
      </div>
      <nav className="nav" style={{marginLeft:'auto'}}>
        <Link className="link" to="/">Início</Link>
        {' '}|{' '}
        <Link className="link" to="/dashboard">Minha Conta</Link>
      </nav>
    </header>
  );
}
