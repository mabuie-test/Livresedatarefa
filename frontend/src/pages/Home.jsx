import React from 'react';
import OrderWizard from '../components/OrderWizard';

export default function Home(){
  return (
    <div>
      <section className="bg-brand text-white rounded-lg p-6 mb-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            <h1 className="text-2xl md:text-4xl font-bold">Livresedatarefa</h1>
            <p className="mt-2 text-sm md:text-lg">Solicite trabalhos académicos e consultoria com segurança e qualidade.</p>
            <div className="mt-4">
              <a href="#order" className="inline-block bg-accent text-white px-5 py-3 rounded-lg shadow">Encomendar Agora</a>
            </div>
          </div>
          <div className="flex-1 w-full">
            {/* imagem/hero: ocultar em muito pequenos */}
            <div className="bg-white text-brand rounded-lg p-4 md:p-6">
              <p className="font-semibold">Rápido. Confiável. Seguro.</p>
              <p className="text-xs md:text-sm text-gray-600">Pagamento por Mpesa/Emola - envio de comprovativos</p>
            </div>
          </div>
        </div>
      </section>

      <section id="order" className="max-w-6xl mx-auto px-4">
        <OrderWizard />
      </section>
    </div>
  );
}
