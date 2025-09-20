import React from 'react';
import OrderWizard from '../components/OrderWizard';

export default function Home(){
  return (
    <div>
      <section className="bg-brand text-white rounded-lg p-8 mb-6 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Livresedatarefa</h1>
            <p className="mt-2 text-lg">Solicite trabalhos académicos e consultoria com segurança e qualidade.</p>
            <div className="mt-4">
              <a href="#order" className="inline-block bg-accent text-white px-5 py-3 rounded-lg shadow">Encomendar Agora</a>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white text-brand rounded-lg p-6">
              <p className="font-semibold">Rápido. Confiável. Seguro.</p>
              <p className="text-sm text-gray-600">Pagamento por Mpesa/Emola - envio de comprovativos</p>
            </div>
          </div>
        </div>
      </section>

      <section id="order" className="container mx-auto">
        <OrderWizard />
      </section>
    </div>
  );
}
