import React, { useState, useEffect, useRef } from 'react';
import api from '../lib/api.js';
import PricePreview from './PricePreview.jsx';
import Notice from './Notice.jsx';

export default function OrderWizard(){
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
        setPrice(res.data);
      } catch(e){
        setPrice(null);
      } finally { setEstimating(false); }
    },350);
    return ()=>clearTimeout(debounce.current);
  },[form.serviceType, form.academicLevel, form.pages, form.style, form.methodology, form.urgencyDays, form.urgent, form.electronicsComplexity]);

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
      const payload={...form,pages:Number(form.pages)||1};
      const res = await api.post('/api/orders/guest', payload);
      const order = res.data.order;
      setNotice({type:'success',text:`Pedido criado: ${order.reference}`});
      setTimeout(()=> window.location.href = `/orders/guest/${encodeURIComponent(order.reference)}?email=${encodeURIComponent(form.email)}`,800);
    } catch (err){
      setNotice({type:'error',text: err.response?.data?.error || err.message});
    } finally { setCreating(false); }
  }

  return (
    <div className="card">
      <h3>Formulário de Encomenda</h3>
      {notice && <Notice type={notice.type}>{notice.text}</Notice>}
      <form onSubmit={handle}>
        <div className="form-row">
          <label className="small">Serviço</label>
          <select className="input" value={form.serviceType} onChange={e=>update('serviceType', e.target.value)}>
            <option value="redacao">Redação</option>
            <option value="consultoria">Consultoria</option>
            <option value="projeto-eletronica">Projeto Electrónica/Elétrica</option>
          </select>
        </div>

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

        <div className="form-row">
          <label className="small">Tipo de redação</label>
          <select className="input" value={form.style} onChange={e=>update('style', e.target.value)}>
            <option value="argumentacao">Argumentação</option>
            <option value="persuasao">Persuasão</option>
            <option value="reflexivo">Reflexivo</option>
            <option value="normativo">Normativo</option>
          </select>
        </div>

        <div className="form-row">
          <label className="small">Área de pesquisa</label>
          <input className="input" value={form.area} onChange={e=>update('area', e.target.value)} placeholder="Ex.: Educação, Electrónica..." />
        </div>

        <div className="form-row">
          <label className="small">Prazo (dias)</label>
          <input className="input" type="number" min="1" value={form.urgencyDays} onChange={e=>update('urgencyDays', Number(e.target.value)||1)} />
        </div>

        {form.serviceType==='projeto-eletronica' && (
          <div className="form-row">
            <label className="small">Complexidade (electrónica)</label>
            <select className="input" value={form.electronicsComplexity} onChange={e=>update('electronicsComplexity', e.target.value)}>
              <option value="basico">Básico</option>
              <option value="medio">Médio</option>
              <option value="complexo">Complexo</option>
            </select>
          </div>
        )}

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
