import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { API } from '../lib/api';
import MpesaProofUpload from '../components/MpesaProofUpload';

export default function OrderDetail(){
  const { id } = useParams();
  const [order,setOrder] = useState(null);
  useEffect(()=>{ async function load(){ try{ const res = await api.get(`/api/orders/${id}`); setOrder(res.data.order);}catch(err){ alert('Erro: ' + (err.response?.data?.error || err.message)); } } load(); },[id]);
  if(!order) return <div>Carregando...</div>;
  const invoiceUrl = order.invoiceFileId ? `${API}/api/files/${order.invoiceFileId}` : null;
  const adminFileUrl = order.adminFileId ? `${API}/api/files/${order.adminFileId}` : null;
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Pedido {order.reference}</h2>
      <div className="mb-3">Total: {order.totalPriceMZN} MZN</div>
      {invoiceUrl ? <a href={invoiceUrl} target="_blank" rel="noreferrer" className="bg-brand text-white px-3 py-2 rounded">Abrir Recibo</a> : <div>Recibo não disponível</div>}
      <div className="mt-4"><MpesaProofUpload orderId={order._id} onUploaded={(o)=>setOrder(o)} /></div>
      {adminFileUrl && <div className="mt-3"><a href={adminFileUrl} className="bg-accent text-white px-3 py-2 rounded">Baixar Ficheiro Final</a></div>}
    </div>
  );
}
