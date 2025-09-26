import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api, { API } from '../lib/api.js';
import MpesaProofUpload from '../components/MpesaProofUpload.jsx';

export default function GuestOrderDetail(){
  const { reference } = useParams();
  const [qs] = useSearchParams();
  const email = qs.get('email') || '';
  const [order,setOrder]=useState(null);

  useEffect(()=>{ async function load(){ if(!email){ alert('Email necessário'); return; } try{ const res = await api.get(`/api/orders/guest/${reference}?email=${encodeURIComponent(email)}`); setOrder(res.data.order); }catch(e){ alert(e.response?.data?.error||e.message);} } load(); },[reference,email]);

  if(!order) return <div className="container">Carregando...</div>;
  const invoiceUrl = order.invoiceFileId ? `${API}/api/files/${order.invoiceFileId}` : null;
  return (
    <div className="container">
      <div className="card">
        <h3>Pedido {order.reference}</h3>
        <p>Total: {order.totalPriceMZN} MZN</p>
        {invoiceUrl ? <button className="btn" onClick={()=>window.open(invoiceUrl,'_blank')}>Abrir Recibo</button> : <p className="small">Recibo não disponível</p>}
        <div style={{marginTop:12}}><MpesaProofUpload orderId={order._id} onUploaded={()=>{}} /></div>
      </div>
    </div>
  );
}
