import React, { useState } from 'react';
import api from '../lib/api';

export default function MpesaProofUpload({ orderId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');

  async function handleUpload(e){
    e.preventDefault();
    if (!file) return alert('Selecione um comprovativo');
    const fd = new FormData();
    fd.append('proof', file);
    fd.append('mpesaReference', reference);
    fd.append('amount', amount);
    try {
      const res = await api.post(`/api/orders/${orderId}/mpesa-proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      alert('Comprovativo enviado');
      if (onUploaded) onUploaded(res.data.order);
    } catch (err) {
      alert('Erro no upload: ' + (err.response?.data?.error || err.message));
    }
  }

  return (
    <form onSubmit={handleUpload} className="bg-white p-4 rounded">
      <label className="block">
        <span>Comprovativo (JPG/PNG/PDF)</span>
        <input type="file" accept=".jpg,.png,.pdf" onChange={e => setFile(e.target.files[0])} className="mt-1" />
      </label>
      <label className="block mt-2">
        <span>Referência</span>
        <input value={reference} onChange={e => setReference(e.target.value)} className="mt-1 block w-full" />
      </label>
      <label className="block mt-2">
        <span>Valor (MZN)</span>
        <input value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full" />
      </label>
      <div className="mt-3">
        <button className="bg-brand text-white px-4 py-2 rounded">Enviar comprovativo</button>
      </div>
    </form>
  );
}
