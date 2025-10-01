import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

export default function GuestOrderDetail(){
  const { id } = useParams();
  const [order,setOrder] = useState(null);

  useEffect(()=>{ async function l(){ const res = await api.get(`/orders/${id}`); setOrder(res.data.order);} l(); },[id]);

  if(!order) return <div>Carregando...</div>;
  return (
    <div>
      <h2>Pedido {order.reference}</h2>
      <div className="card">
        <div><strong>Total:</strong> {order.totalPriceMZN} MZN</div>
        <div><strong>Status:</strong> {order.status}</div>
        <div style={{marginTop:8}}>
          <a className="btn" href={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/files/${order._id}`}>Ver Invoice (PDF)</a>
        </div>
      </div>
    </div>
  );
}
