import React from 'react';
export default function Hero(){
  return (
    <section className="bg-brand text-white py-8 rounded mb-6">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold">Livresedatarefa</h1>
          <p className="mt-2 text-sm md:text-lg">Encomende trabalhos académicos, consultoria e projectos — pagamento por Mpesa/Emola.</p>
        </div>
        <div className="w-full md:w-1/3 bg-white text-brand rounded p-4 shadow">
          <div className="text-sm font-medium">Comece agora</div>
        </div>
      </div>
    </section>
  );
}
