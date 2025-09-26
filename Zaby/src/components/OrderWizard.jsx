import React, { useState, useEffect, useRef } from 'react';
import api from '../lib/api.js';
import PricePreview from './PricePreview.jsx';
import Notice from './Notice.jsx';
import { useNavigate } from 'react-router-dom';

export default function OrderWizard(){
  const navigate = useNavigate();
  const [form, setForm] = useState({
    serviceType:'redacao', academicLevel:'licenciatura', pages:5, style:'argumentacao',
    methodology:'qualitativa', area:'', urgencyDays:7, urgent:false, extraInfo:'', email:'', whatsapp:'', electronicsComplexity:'basico'
  });
  const [price,setPrice]=useState(null);
  const [estimating,setEstimating]=useState(false);
  const [creating,setCreating]=useState(false);
  const [notice,setNotice]=useState(null);
  const debounce = useRef(null);

  function update(k,v){ setForm(s=>({...s,[k]:v})); }

  // Recálculo: incluímos urgent e urgencyDays explicitamente
  useEffect(()=>{
    setEstimating(true);
    if(debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async ()=>{
      try {
        const payload = {
          serviceType: form.serviceType,
          academicLevel: form.academicLevel,
          pages: Number(form.pages)||1,
          style: form.style,
          methodology: form.methodology,
          urgencyDays: Number(form.urgencyDays)||7,
          urgent: !!form.urgent,
          extras: form.serviceType==='projeto-eletronica' ? (form.electronicsComplexity==='medio'?500:form.electronicsComplexity==='complexo'?1200:0) : 0
        };
        const res = await api.post('/api/orders/estimate', payload);
        // backend should return { basePriceMZN, urgencySurchargeMZN, totalPriceMZN }
        setPrice(res.data);
      } catch(e){
        setPrice(null);
      } finally { setEstimating(false); }
    }, 250);
    return ()=>clearTimeout(debounce.current);
  }, [form.serviceType, form.academicLevel, form.pages, form.style, form.methodology, form.urgencyDays, form.urgent, form.electronicsComplexity]);

  function validate(){
    if(!form.area){ setNotice({type:'error',text:'Indique a área de pesquisa'}); return false;}
    if(!form.pages || form.pages<1){ setNotice({type:'error',text:'Nº de páginas inválido'}); return false;}
    if(!form.email){ setNotice({type:'error',text:'Insira um email (ou faça login)'}); return false;}
    return true;
  }

  async function handle(e){
    e?.preventDefault();
    if(!validate()) return;
    setCreating(true);
    try {
      const payload = {
        serviceType: form.serviceType,
        academicLevel: form.academicLevel,
        pages: Number(form.pages)||1,
        style: form.style,
        methodology: form.methodology,
        area: form.area,
        extraInfo: form.extraInfo,
        urgencyDays: Number(form.urgencyDays)||7,
        urgent: !!form.urgent,
        email: form.email,
        whatsapp: form.whatsapp,
        electronicsComplexity: form.serviceType==='projeto-eletronica' ? form.electronicsComplexity : undefined
      };
      // Criar como guest se sem token
      const token = localStorage.getItem('token');
      const res = token ? await api.post('/api/orders', payload) : await api.post('/api/orders/guest', payload);
      const order = res.data.order;
      setNotice({type:'success', text:`Pedido criado: ${order.reference}`});
      // navegar sem reload (evita 404)
      setTimeout(()=> {
        if(token) navigate(`/orders/${order._id}`);
        else navigate(`/orders/guest/${encodeURIComponent(order.reference)}?email=${encodeURIComponent(form.email)}`);
      }, 700);
    } catch (err){
      setNotice({type:'error', text: err.response?.data?.error || err.message || 'Erro ao criar encomenda'});
    } finally { setCreating(false); }
  }

  return (
    <div className="card">
      <h3>Formulário</h3>
      {notice && <Notice type={notice.type}>{notice.text}</Notice>}
      <form onSubmit={handle}>
        {/* simplified layout */}
        <div className="form-row">
          <label className="small">Serviço</label>
          <select className="input" value={form.serviceType} onChange={e=>update('serviceType', e.target.value)}>
            <option value="redacao">Redação</option>
            <option value="consultoria">Consultoria</option>
            <option value="projeto-eletronica">Projeto Electrónica/Elétrica</option>
          </select>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="form-row">
            <label className="small">Nível académico</label>
            <select className="input" value={form.academicLevel} onChange={e=>update('academicLevel', e.target.value)}>
              <option value="secundario">Secundário</option>
              <option value="licenciatura">Licenciatura</option>
              <option value="mestrado">Mestrado</option>
              <option value="doutoramento">Doutoramento</option>
            </select>
          </div>

          <div className="form-row">
            <label className="small">Páginas</label>
            <input className="input" type="number" min="1" value={form.pages} onChange={e=>update('pages', Number(e.target.value)||1)} />
          </div>
        </div>

        <div className="form-row">
          <label className="small">Área de pesquisa</label>
          <input className="input" value={form.area} onChange={e=>update('area', e.target.value)} />
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,alignItems:'center'}}>
          <div className="form-row">
            <label className="small">Prazo (dias)</label>
            <input className="input" type="number" min="1" value={form.urgencyDays} onChange={e=>update('urgencyDays', Number(e.target.value)||1)} />
          </div>

          <div className="form-row">
            <label className="small">Marcar como urgente</label>
            <label className="checkbox-inline">
              <input type="checkbox" checked={form.urgent} onChange={e=>update('urgent', e.target.checked)} />
              <span className="small">Sobretaxa será aplicada</span>
            </label>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:12}}>
          <div>
            <div className="form-row"><label className="small">Informações adicionais</label><textarea className="input" rows="4" value={form.extraInfo} onChange={e=>update('extraInfo', e.target.value)} /></div>
            <div className="form-row"><label className="small">Email</label><input className="input" value={form.email} onChange={e=>update('email', e.target.value)} /></div>
            <div className="form-row"><label className="small">WhatsApp</label><input className="input" value={form.whatsapp} onChange={e=>update('whatsapp', e.target.value)} /></div>
            <div style={{marginTop:8}}><button className="btn" type="submit" disabled={creating}>{creating? 'A criar...':'Gerar Encomenda & Invoice'}</button></div>
          </div>

          <div>
            {estimating ? <div className="card small">A calcular preço...</div> : <PricePreview price={price} />}
          </div>
        </div>
      </form>
    </div>
  );
}
