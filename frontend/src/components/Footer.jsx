import React from 'react';
import { Link } from 'react-router-dom';
import { getToken, getUser } from '../lib/auth';

const quickLinks = [
  { label: 'Termos', to: '/terms' },
  { label: 'Privacidade', to: '/privacy' },
  { label: 'Perguntas Frequentes', to: '/faq' },
];

export default function Footer() {
  const token = getToken();
  const user = getUser();
  const isAdmin = user && user.role === 'admin';

  return (
    <footer className="mt-20">
      <div className="bg-gradient-to-r from-brand via-purple-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto grid gap-10 px-6 py-14 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold leading-snug">Pronto para transformar o seu próximo trabalho académico?</h2>
            <p className="text-sm text-white/80">
              Receba um plano personalizado, calendário de entregas e acompanhamento contínuo. Estamos disponíveis para reagir a prazos urgentes e ajustes de última hora.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#order"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Encomendar agora
              </a>
              <a
                href="mailto:contacto@livresedatarefa.com"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                contacto@livresedatarefa.com
              </a>
            </div>
          </div>
          <div className="grid gap-6 text-sm">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Suporte ao Cliente</h3>
              <ul className="mt-3 space-y-2 text-white/80">
                <li className="flex items-center gap-2">
                  <span className="text-base">💬</span>
                  Atendimento via WhatsApp e e-mail 7 dias/semana
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base">🕒</span>
                  Resposta média em 23 minutos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base">🔐</span>
                  Dados e ficheiros protegidos por encriptação
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Links úteis</h3>
              <div className="mt-3 flex flex-wrap gap-3 text-white/80">
                {quickLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="hover:text-white transition">
                    {link.label}
                  </Link>
                ))}
                {token && (
                  <Link to="/dashboard" className="hover:text-white transition">
                    Minha Conta
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="hover:text-white transition">
                    Painel Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-3 px-6 py-4 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Livresedatarefa. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-gray-600">Pagamentos Mpesa &amp; Emola</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Actualização de estado em tempo real</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
