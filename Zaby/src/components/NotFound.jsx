import React from 'react';
export default function NotFound(){
  return (
    <div className="container" style={{paddingTop:40, paddingBottom:40}}>
      <div className="card">
        <h3>404 — Página não encontrada</h3>
        <p className="small">A página que tentaste abrir não existe. Volta ao início.</p>
        <a className="btn" href="/">Voltar ao início</a>
      </div>
    </div>
  );
}
