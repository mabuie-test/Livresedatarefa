import React, { useState } from 'react';
import api from '../lib/api.js';

export default function MpesaProofUpload({ orderId, onUploaded }){
  const [file, setFile] = useState(null);
  const [mpesaRef, setMpesaRef] = useState('');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e){
    e?.preventDefault();
    if(!file){ setMsg('Selecione um ficheiro'); return; }
    const fd = new FormData();
    fd.append('proof', file);
    fd.append('mpesaReference', mpesaRef);
    fd.append('amount', amount);
    try {
      const res = await api.post(`/api/orders/${orderId}/mpesa-proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setMsg('Comprovativo enviado. Obrigado.');
      if(onUploaded) onUploaded(res.data.order);
    } catch (err){
      setMsg(err.response?.data?.error || err.message || 'Erro no envio');
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="form-row"><label className="small">Ficheiro</label><input className="input" type="file" onChange={e=>setFile(e.target.files[0])} /></div>
      <div className="form-row"><label className="small">Ref Mpesa</label><input className="input" value={mpesaRef} onChange={e=>setMpesaRef(e.target.value)} /></div>
      <div className="form-row"><label className="small">Valor MZN</label><input className="input" value={amount} onChange={e=>setAmount(e.target.value)} /></div>
      <div style={{display:'flex',gap:8}}><button className="btn" type="submit">Enviar</button><div style={{alignSelf:'center'}}>{msg}</div></div>
    </form>
  );
}
