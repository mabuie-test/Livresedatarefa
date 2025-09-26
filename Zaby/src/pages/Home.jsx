import React from 'react';
import OrderWizard from '../components/OrderWizard.jsx';

export default function Home(){
  return (
    <div className="grid cols-2 container" style={{gap:16}}>
      <div>
        <OrderWizard />
      </div>
      <aside>
        <div className="card">
          <h4>Como funciona</h4>
          <p className="small">Escolha serviço, preencha requisitos e gere a invoice para pagamento. Depois envie comprovativo Mpesa/Emola.</p>
        </div>
      </aside>
    </div>
  );
}
