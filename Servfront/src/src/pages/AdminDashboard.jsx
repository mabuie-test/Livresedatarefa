import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function AdminDashboard(){
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/api/admin/orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Painel Admin</h2>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{o.reference} — {o.serviceType}</div>
              <div className="text-sm text-gray-500">{o.guestEmail || o.userId} • {o.totalPriceMZN} MZN</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={async () => {
                await api.post(`/api/admin/orders/${o._id}/confirm-payment`);
                alert('Pagamento confirmado.');
              }}>Confirmar Pagamento</button>
            </div>
          </div>
        ))}
        {orders.length === 0 && <div className="bg-white p-4 rounded">Nenhum pedido (ou sem permissão).</div>}
      </div>
    </div>
  );
}
