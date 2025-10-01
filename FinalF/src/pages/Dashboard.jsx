import React, {useEffect, useState} from 'react';
import api from '../lib/api';
import { getUserFromToken } from '../lib/auth';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  const [orders,setOrders]=useState([]);
  const user = getUserFromToken();

  useEffect(()=>{
    async function load(){
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    }
    load();
  },[]);

  return (
    <div>
      <h2>Dashboard — {user?.email}</h2>
      <div style={{display:'grid',gap:8}}>
        {orders.map(o => (
          <div key={o._id} className="card">
            <div><strong>{o.reference}</strong> — {o.totalPriceMZN} MZN</div>
            <div>Status: {o.status}</div>
            <Link to={`/order/${o._id}`} className="btn" style={{marginTop:8}}>Ver</Link>
          </div>
        ))}
        {orders.length===0 && <div>Nenhuma encomenda</div>}
      </div>
    </div>
  );
}
