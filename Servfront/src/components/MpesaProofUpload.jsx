import React, { useState } from 'react';
import api from '../lib/api';
import { pushLog } from '../lib/errorLogger';

export default function MpesaProofUpload({ orderId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) { setMessage({ type: 'error', text: 'Selecione um comprovativo.' }); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('proof', file);
      fd.append('mpesaReference', reference);
      fd.append('amount', amount);
      const res = await api.post(`/api/orders/${orderId}/mpesa-proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setMessage({ type: 'success', text: 'Comprovativo enviado com sucesso.' });
      pushLog({ type: 'mpesa_proof_uploaded', orderId, filename: file.name, amountReported: amount });
      if (onUploaded) onUploaded(res.data.order);
    } catch (err) {
      pushLog({ type: 'mpesa_proof_upload_failed', orderId, filename: file?.name, error: err.message, response: err.response?.data });
      setMessage({ type: 'error', text: 'Erro ao enviar comprovativo. Abra /debug e envie os logs.' });
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleUpload} className="bg-white p-4 rounded">
      <label className="block"><span className="text-sm">Comprovativo (JPG/PNG/PDF)</span><input type="file" accept=".jpg,.png,.pdf" onChange={e => setFile(e.target.files[0])} className="mt-1" /></label>
      <label className="block mt-2"><span className="text-sm">Referência</span><input value={reference} onChange={e => setReference(e.target.value)} className="mt-1 block w-full" /></label>
      <label className="block mt-2"><span className="text-sm">Valor (MZN)</span><input value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full" /></label>

      {message && (
        <div className={`mt-3 p-2 rounded text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div className="mt-3">
        <button disabled={loading} className={`px-4 py-2 rounded ${loading ? 'bg-gray-300 text-gray-700' : 'bg-brand text-white'}`}>
          {loading ? 'Enviando...' : 'Enviar comprovativo'}
        </button>
      </div>
    </form>
  );
}
