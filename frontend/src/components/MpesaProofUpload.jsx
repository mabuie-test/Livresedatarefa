import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function MpesaProofUpload({ orderId }){
  const [file, setFile] = useState(null);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');

  async function handleUpload(e){
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Login necessario');
    if (!file) return alert('Selecione um ficheiro');
    const fd = new FormData();
    fd.append('proof', file);
    fd.append('mpesaReference', reference);
    fd.append('amount', amount);
    try {
      const res = await axios.post(`${API}/api/orders/${orderId}/mpesa-proof`, fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert('Comprovativo enviado');
    } catch (err) {
      alert('Erro no upload: ' + err.response?.data?.error || err.message);
    }
  }

  return (
    <form onSubmit={handleUpload} className="bg-white p-4 rounded">
      <label className="block">
        <span>Comprovativo (JPG/PNG/PDF)</span>
        <input type="file" accept=".jpg,.png,.pdf" onChange={e => setFile(e.target.files[0])} className="mt-1" />
      </label>
      <label className="block mt-2">
        <span>Referência da transferência</span>
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
