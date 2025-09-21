// frontend/src/components/OrderCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderCard({ order }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">Ref: {order.reference}</div>
          <div className="font-semibold">{order.serviceType} — {order.academicLevel}</div>
          <div className="text-sm text-gray-600">Páginas: {order.pages} • Total: {order.totalPriceMZN} MZN</div>
        </div>
        <div className="text-sm flex flex-col items-end gap-2">
          <div>Status: <span className="font-medium">{order.status}</span></div>
          <Link to={`/orders/${order._id}`} className="text-xs text-white bg-brand px-3 py-1 rounded">Ver pedido</Link>
        </div>
      </div>
    </div>
  );
}
