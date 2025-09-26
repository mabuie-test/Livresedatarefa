import React, { useEffect, useState } from 'react';
import api from '../lib/api.js';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const [orders,setOrders]=useState([]);
  const navigate = useNavigate();

  useEffect(()=>{ async function load(){ try{ const res = await api.get('/api/orders'); setOrders(res.data.orders||[]); }catch(e){ console.error(e);} } load(); },[]);

  return (
    <div className="container">
      <h3>Meus Pedidos</h3>
      <div className="order-list">
        {orders.length===0 && <div className="card">Nenhum pedido</div>}
        {orders.map(o=>(
          <div key={o._id} className="order-item">
            <div>
              <div style={{fontWeight:700}}>{o.reference}</div>
              <div className="small">{o.serviceType} • {o.pages} pág • {o.totalPriceMZN} MZN</div>
            </div>
            <div>
              <button className="btn" onClick={()=>navigate(`/orders/${o._id}`)}>Ver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
