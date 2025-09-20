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
        <div className="text-sm">
          <div className="mb-2">Status: <span className="font-medium">{order.status}</span></div>
          <Link to={`/dashboard`} className="text-xs text-brand underline">Ver pedido</Link>
        </div>
      </div>
    </div>
  );
}
