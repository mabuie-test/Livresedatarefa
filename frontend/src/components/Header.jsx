import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { getToken, getUser, logout } from '../lib/auth';

export default function Header(){
  const [open, setOpen] = useState(false);
  const token = getToken();
  const user = getUser();
  const isAdmin = user && user.role === 'admin';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10" alt="Livresedatarefa" />
          <div>
            <div className="text-lg font-semibold text-brand leading-tight">Livresedatarefa</div>
            <div className="text-xs text-gray-500">Trabalhos com liberdade. Pesquisa com rigor.</div>
          </div>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          {!token && <Link to="/login" className="text-sm text-white bg-brand px-3 py-2 rounded">Entrar</Link>}
          {!token && <Link to="/register" className="text-sm text-gray-700">Registar</Link>}

          {token && <Link to="/dashboard" className="text-sm text-gray-700">Minha Conta</Link>}
          {isAdmin && <Link to="/admin" className="text-sm text-gray-700">Painel Admin</Link>}

          {token && <button onClick={logout} className="text-sm text-red-600">Sair</button>}
        </nav>

        {/* mobile hamburger */}
        <div className="md:hidden">
          <button onClick={() => setOpen(v => !v)} aria-label="menu"
            className="p-2 rounded border border-gray-200 bg-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div className={`md:hidden transition-all duration-150 ${open ? 'max-h-[400px] visible' : 'max-h-0 overflow-hidden'}`}>
        <div className="max-w-6xl mx-auto p-4 flex flex-col gap-3">
          {!token && <Link to="/login" className="block w-full text-center text-base font-medium text-white bg-brand px-4 py-3 rounded" onClick={() => setOpen(false)}>Entrar</Link>}
          {!token && <Link to="/register" className="block w-full text-center text-base text-gray-700 px-4 py-3 rounded" onClick={() => setOpen(false)}>Registar</Link>}

          {token && <Link to="/dashboard" className="block w-full text-left text-base text-gray-700 px-4 py-3 rounded" onClick={() => setOpen(false)}>Minha Conta</Link>}
          {isAdmin && <Link to="/admin" className="block w-full text-left text-base text-gray-700 px-4 py-3 rounded" onClick={() => setOpen(false)}>Painel Admin</Link>}
          {token && <button onClick={() => { logout(); setOpen(false); }} className="w-full text-left text-red-600 px-4 py-3">Sair</button>}
        </div>
      </div>
    </header>
  );
}
