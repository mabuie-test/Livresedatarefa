import React, {useState} from 'react';
import api from '../lib/api';

export default function MpesaProofUpload({orderId, onUploaded}) {
  const [file, setFile] = useState(null);
  const [ref, setRef] = useState('');
  const [amount, setAmount] = useState('');

  async function submit(e){
    e.preventDefault();
    if(!file) return alert('Escolhe um ficheiro');
    const fd = new FormData();
    fd.append('proof', file);
    fd.append('mpesaReference', ref);
    fd.append('amount', amount);
    const res = await api.post(`/orders/${orderId}/mpesa-proof`, fd);
    onUploaded && onUploaded(res.data.order);
  }

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label className="small">Referência MPesa</label>
        <input className="input" value={ref} onChange={e=>setRef(e.target.value)} />
      </div>
      <div className="form-row">
        <label className="small">Valor (MZN)</label>
        <input className="input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} />
      </div>
      <div className="form-row">
        <label className="small">Comprovativo (imagem/pdf)</label>
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
      </div>
      <button className="btn" type="submit">Enviar comprovativo</button>
    </form>
  );
}
