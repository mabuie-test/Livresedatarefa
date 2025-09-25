import React, { useState } from 'react';
import api from '../lib/api';
import { pushLog } from '../lib/errorLogger';

export default function MpesaProofUploadGuest({ reference, email }) {
  const [file, setFile] = useState(null);
  const [mpesaRef, setMpesaRef] = useState('');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) { setMsg('Selecione um ficheiro'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('proof', file);
      fd.append('mpesaReference', mpesaRef);
      fd.append('amount', amount);
      fd.append('email', email);
      await api.post(`/api/orders/guest/${encodeURIComponent(reference)}/mpesa-proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setMsg('Comprovativo enviado. Aguarde confirmação.');
    } catch (err) {
      pushLog({ type: 'guest_mpesa_upload_failed', reference, email, error: err.message });
      setMsg('Erro no envio. Abra /debug e envie logs.');
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleUpload} className="bg-white p-3 rounded">
      <label className="block mb-2"><span className="text-xs">Comprovativo</span><input type="file" accept=".jpg,.png,.pdf" onChange={e => setFile(e.target.files[0])} /></label>
      <label className="block mb-2"><span className="text-xs">Referência Mpesa</span><input value={mpesaRef} onChange={e => setMpesaRef(e.target.value)} className="mt-1 block w-full rounded border px-2 py-1"/></label>
      <label className="block mb-2"><span className="text-xs">Valor (MZN)</span><input value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full rounded border px-2 py-1"/></label>
      <div className="flex gap-2"><button disabled={loading} className="bg-brand text-white px-3 py-2 rounded">{loading ? 'Enviando...' : 'Enviar'}</button><div className="text-sm self-center text-gray-600">{msg}</div></div>
    </form>
  );
}
