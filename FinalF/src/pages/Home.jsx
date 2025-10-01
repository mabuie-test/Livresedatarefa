import React from 'react';
import OrderWizard from '../components/OrderWizard';
import Notice from '../components/Notice';

export default function Home(){
  return (
    <div>
      <h1>Bem-vindo à Livresedatarefa</h1>
      <Notice>
        <strong>Cria uma encomenda rápida</strong>
        <div>Se não tens conta, escolhe "Guest" abaixo.</div>
      </Notice>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
        <OrderWizard guest={false} />
        <div>
          <h3>Guest</h3>
          <OrderWizard guest={true} />
        </div>
      </div>
    </div>
  );
}
