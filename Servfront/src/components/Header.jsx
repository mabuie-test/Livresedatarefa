import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Header(){
  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Livresedatarefa" className="w-10 h-10"/>
          <div>
            <div className="text-base font-semibold text-brand">Livresedatarefa</div>
            <div className="text-xs text-gray-500">Trabalhos com liberdade. Pesquisa com rigor.</div>
          </div>
        </Link>
        <nav className="hidden sm:flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-gray-700">Minha Conta</Link>
          <Link to="/admin" className="text-sm text-gray-700">Admin</Link>
          <Link to="/debug" className="text-sm text-gray-500">Debug</Link>
          <Link to="/login" className="text-sm bg-brand text-white px-3 py-1 rounded">Entrar</Link>
        </nav>
      </div>
    </header>
  );
}
