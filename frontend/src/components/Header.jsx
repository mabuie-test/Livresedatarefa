import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Header(){
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10" alt="Livresedatarefa" />
          <div>
            <div className="text-lg font-semibold text-brand">Livresedatarefa</div>
            <div className="text-xs text-gray-500">Trabalhos com liberdade. Pesquisa com rigor.</div>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-gray-700">Minha Conta</Link>
          <Link to="/admin" className="text-sm text-gray-700">Painel Admin</Link>
          <Link to="/login" className="text-sm text-white bg-brand px-3 py-2 rounded">Entrar</Link>
        </nav>
      </div>
    </header>
  );
}
