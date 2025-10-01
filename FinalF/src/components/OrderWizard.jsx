import React, {useState} from 'react';
import api from '../lib/api';
import PricePreview from './PricePreview';
import { useNavigate } from 'react-router-dom';

export default function OrderWizard({guest=false}) {
  const [form, setForm] = useState({serviceType:'redacao',academicLevel:'licenciatura',pages:3,urgent:false,urgencyDays:3,email:''});
  const [price, setPrice] = useState(null);
  const nav = useNavigate();

  async function estimate(){
    const res = await api.post('/orders/estimate', form);
    setPrice(res.data);
  }

  async function submit(e){
    e.preventDefault();
    try {
      const url = guest ? '/orders/guest' : '/orders';
      const res = await api.post(url, form);
      const id = res.data.order._id;
      nav(guest ? `/guest-order/${id}` : `/order/${id}`);
    } catch(err){
      alert(err?.response?.data?.error || 'Erro ao criar encomenda');
    }
  }

  return (
    <div className="card">
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Tipo de serviço</label>
          <select className="input" value={form.serviceType} onChange={e=>setForm({...form,serviceType:e.target.value})}>
            <option value="redacao">Redação / Trabalho</option>
            <option value="correcao">Correção</option>
          </select>
        </div>

        <div className="form-row">
          <label>Nível académico</label>
          <select className="input" value={form.academicLevel} onChange={e=>setForm({...form,academicLevel:e.target.value})}>
            <option value="licenciatura">Licenciatura</option>
            <option value="mestrado">Mestrado</option>
            <option value="doutoramento">Doutoramento</option>
            <option value="secundario">Secundário</option>
          </select>
        </div>

        <div className="form-row">
          <label>Páginas</label>
          <input className="input" type="number" value={form.pages} onChange={e=>setForm({...form,pages:e.target.value})} />
        </div>

        <div className="form-row">
          <label>Urgente?</label>
          <input type="checkbox" checked={form.urgent} onChange={e=>setForm({...form,urgent:e.target.checked})} />
        </div>

        {guest && <div className="form-row"><label>Email (para envio)</label><input className="input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>}

        <div style={{display:'flex',gap:8}}>
          <button type="button" className="btn" onClick={estimate}>Estimar preço</button>
          <button className="btn" type="submit">Criar encomenda</button>
        </div>
      </form>
      <PricePreview price={price} />
    </div>
  );
}
