import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import OrderCard from '../components/OrderWizard'; // small placeholder: you can create a nicer OrderCard later

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
    <div>
      <h2 className="text-2xl font-semibold mb-4">Meus Pedidos</h2>
      <div className="space-y-4">
        {orders.length === 0 && <div className="bg-white p-4 rounded">Nenhum pedido encontrado.</div>}
        {orders.map(o => (
          <div key={o._id} className="bg-white p-3 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-500">Ref: {o.reference}</div>
                <div className="font-semibold">{o.serviceType} — {o.academicLevel}</div>
                <div className="text-sm text-gray-600">Páginas: {o.pages} • Total: {o.totalPriceMZN} MZN</div>
              </div>
              <div>
                <a href={`/orders/${o._id}`} className="bg-brand text-white px-3 py-1 rounded">Ver pedido</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
