import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { API } from '../lib/api.js';
import MpesaProofUpload from '../components/MpesaProofUpload.jsx';

export default function OrderDetail(){
  const { id } = useParams();
  const [order,setOrder]=useState(null);

  useEffect(()=>{ async function load(){ try{ const res = await api.get(`/api/orders/${id}`); setOrder(res.data.order); }catch(e){ alert(e.response?.data?.error||e.message);} } load(); },[id]);

  if(!order) return <div className="container">Carregando...</div>;
  const invoiceUrl = order.invoiceFileId ? `${API}/api/files/${order.invoiceFileId}` : null;
  return (
    <div className="container">
      <div className="card">
        <h3>Pedido {order.reference}</h3>
        <p>Total: {order.totalPriceMZN} MZN</p>
        {invoiceUrl ? <button className="btn" onClick={()=>window.open(invoiceUrl,'_blank')}>Abrir Recibo</button> : <p className="small">Recibo não disponível</p>}
        <div style={{marginTop:12}}><MpesaProofUpload orderId={order._id} onUploaded={(o)=>setOrder(o)} /></div>
      </div>
    </div>
  );
}
