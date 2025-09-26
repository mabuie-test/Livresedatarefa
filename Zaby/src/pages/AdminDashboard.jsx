import React, { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function AdminDashboard(){
  const [orders,setOrders]=useState([]);
  useEffect(()=>{ async function load(){ try{ const res = await api.get('/api/admin/orders'); setOrders(res.data.orders||[]); }catch(e){ console.error(e);} } load(); },[]);
  return (
    <div className="container">
      <h3>Painel Admin</h3>
      <div className="order-list">
        {orders.length===0 && <div className="card">Nenhum pedido</div>}
        {orders.map(o=>(
          <div key={o._id} className="order-item">
            <div>
              <div style={{fontWeight:700}}>{o.reference}</div>
              <div className="small">{o.serviceType} • {o.totalPriceMZN} MZN</div>
            </div>
            <div>
              <button className="btn" onClick={async ()=>{
                await api.post(`/api/admin/orders/${o._id}/confirm-payment`);
                alert('Pagamento confirmado');
              }}>Confirmar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
