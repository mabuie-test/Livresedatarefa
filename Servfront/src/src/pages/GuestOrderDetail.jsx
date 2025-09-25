import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api, { API } from '../lib/api';
import MpesaProofUploadGuest from '../components/MpesaProofUploadGuest';

export default function GuestOrderDetail(){
  const { reference } = useParams();
  const [qs] = useSearchParams();
  const email = qs.get('email') || '';
  const [order,setOrder] = useState(null);
  useEffect(()=> {
    async function load(){ 
      if(!email){ alert('Email necessario'); return; } 
      try{ 
        const res = await api.get(`/api/orders/guest/${reference}?email=${encodeURIComponent(email)}`); 
        setOrder(res.data.order);
      }catch(err){ alert('Erro: ' + (err.response?.data?.error||err.message)); } 
    }
    load();
  },[reference,email]);
  if(!order) return <div>Carregando...</div>;
  const invoiceUrl = order.invoiceFileId ? `${API}/api/files/${order.invoiceFileId}` : null;
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Pedido {order.reference}</h2>
      <div className="mb-3">Total: {order.totalPriceMZN} MZN</div>
      {invoiceUrl ? <a href={invoiceUrl} target="_blank" rel="noreferrer" className="bg-brand text-white px-3 py-2 rounded">Abrir Recibo</a> : <div>Recibo não disponível</div>}
      <div className="mt-4"><h3 className="font-medium">Enviar comprovativo</h3><MpesaProofUploadGuest reference={order.reference} email={order.guestEmail} /></div>
    </div>
  );
}
