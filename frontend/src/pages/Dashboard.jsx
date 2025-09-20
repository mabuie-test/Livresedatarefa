import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import OrderCard from '../components/OrderCard';
import MpesaProofUpload from '../components/MpesaProofUpload';

export default function Dashboard(){
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/api/orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Meus Pedidos</h2>
        <div className="space-y-4">
          {orders.length === 0 && <div className="bg-white p-4 rounded">Nenhum pedido encontrado.</div>}
          {orders.map(o => <OrderCard key={o._id} order={o} />)}
        </div>
      </div>
      <aside>
        <h3 className="text-lg font-semibold mb-3">Enviar comprovativo</h3>
        {/* Para exemplo: pede orderId manualmente */}
        <div className="bg-white p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">Selecione um pedido e envie o comprovativo.</p>
          {/* In a full UI you'd list orders and attach upload per order; for now include the component and pass orderId */}
          {/* Example usage: <MpesaProofUpload orderId={orders[0]._id} /> */}
          <p className="text-xs text-gray-400">(Para enviar comprovativo, abra um pedido e use o botão enviar no detalhe do pedido.)</p>
        </div>
      </aside>
    </div>
  );
}
