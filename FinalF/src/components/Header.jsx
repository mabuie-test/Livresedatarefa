import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUserFromToken } from '../lib/auth';

export default function Header(){
  const user = getUserFromToken();
  const nav = useNavigate();
  return (
    <header className="header">
      <div className="brand container" style={{display:'flex',alignItems:'center',width:'100%'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="logo">L</div>
          <div>
            <div style={{fontWeight:700}}>Livresedatarefa</div>
            <div style={{fontSize:12,color:'#fff',opacity:0.9}}>Serviços académicos</div>
          </div>
        </div>

        <nav className="nav">
          <Link to="/" className="btn">Home</Link>

          {/* Se não está autenticado mostra Login e Registo */}
          {!user && (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Registo</Link>
            </>
          )}

          {/* Se está autenticado mostra Dashboard e Sair */}
          {user && (
            <>
              <Link to="/dashboard" className="btn">Dashboard</Link>
              {user.role === 'admin' && <Link to="/admin" className="btn">Admin</Link>}
              <button className="btn" onClick={() => { logout(); nav('/login'); }}>Sair</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
