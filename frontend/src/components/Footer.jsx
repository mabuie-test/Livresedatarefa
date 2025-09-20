import React from 'react';
import { getToken, getUser } from '../lib/auth';
import { Link } from 'react-router-dom';

export default function Footer(){
  const token = getToken();
  const user = getUser();
  const isAdmin = user && user.role === 'admin';

  return (
    <footer className="bg-white mt-8 border-t">
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600">
        <div>© {new Date().getFullYear()} Livresedatarefa</div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/terms" className="text-xs text-gray-500">Termos</Link>
          <Link to="/privacy" className="text-xs text-gray-500">Privacidade</Link>
          {token && <Link to="/dashboard" className="text-xs text-gray-700">Minha Conta</Link>}
          {isAdmin && <Link to="/admin" className="text-xs text-gray-700">Painel Admin</Link>}
        </div>
      </div>
    </footer>
  );
}
