import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import PricePreview from './PricePreview';
import { getToken } from '../lib/auth';
import { pushLog } from '../lib/errorLogger';

export default function OrderWizard(){
  const nav = useNavigate();
  const [form, setForm] = useState({
    serviceType: 'redacao',
    academicLevel: 'licenciatura',
    pages: 5,
    style: 'argumentacao',
    methodology: 'qualitativa',
    area: '',
    urgencyDays: 7,
    urgent: false,
    extraInfo: '',
    email: '',
    whatsapp: '',
    electronicsComplexity: 'basico'
  });
  const [price, setPrice] = useState(null);
  const [estimating, setEstimating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const debounce = useRef(null);

  function update(k,v){ setForm(s => ({...s, [k]: v })); }

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    setEstimating(true);
    debounce.current = setTimeout(async () => {
      try {
        const payload = {
          serviceType: form.serviceType,
          academicLevel: form.academicLevel,
          pages: Number(form.pages)||1,
          style: form.style,
          methodology: form.methodology,
          urgencyDays: Number(form.urgencyDays)||7,
          urgent: !!form.urgent,
          extras: form.serviceType === 'projeto-eletronica' ? (form.electronicsComplexity === 'medio' ? 500 : form.electronicsComplexity === 'complexo' ? 1200 : 0) : 0
        };
        const res = await api.post('/api/orders/estimate', payload);
        setPrice(res.data);
      } catch (err) {
        setPrice(null);
      } finally { setEstimating(false); }
    }, 350);
    return () => clearTimeout(debounce.current);
  }, [form.serviceType,form.academicLevel,form.pages,form.style,form.methodology,form.urgencyDays,form.urgent,form.electronicsComplexity]);

  function validate(){
    setError('');
    if (!form.area) { setError('Indique a área de pesquisa.'); return false; }
    if (!form.pages || form.pages < 1) { setError('Nº páginas inválido.'); return false; }
    if (!form.email && !getToken()) { setError('Insira email ou faça login.'); return false; }
    return true;
  }

  async function handleCreate(e){
    e?.preventDefault();
    if (!validate()) return;
    setCreating(true);
    try {
      const payload = {...form, pages: Number(form.pages)||1};
      const token = getToken();
      let res;
      if (token) {
        res = await api.post('/api/orders', payload);
        const order = res.data.order;
        nav(`/orders/${order._id}`);
      } else {
        res = await api.post('/api/orders/guest', payload);
        const order = res.data.order;
        nav(`/orders/guest/${encodeURIComponent(order.reference)}?email=${encodeURIComponent(form.email)}`);
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Erro ao criar encomenda';
      setError(msg);
      pushLog({ type: 'create_order_failed', error: msg, form });
    } finally { setCreating(false); }
  }

  return (
    <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Encomende um trabalho</h3>
      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label><span className="text-xs">Serviço</span>
          <select value={form.serviceType} onChange={e => update('serviceType', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
            <option value="redacao">Redação</option>
            <option value="consultoria">Consultoria</option>
            <option value="projeto-eletronica">Projeto Electrónica/Elétrica</option>
          </select>
        </label>

        <label><span className="text-xs">Nível</span>
          <select value={form.academicLevel} onChange={e => update('academicLevel', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
            <option value="secundario">Secundário</option>
            <option value="licenciatura">Licenciatura</option>
            <option value="mestrado">Mestrado</option>
            <option value="doutoramento">Doutoramento</option>
          </select>
        </label>

        <label><span className="text-xs">Páginas</span>
          <input type="number" min="1" value={form.pages} onChange={e => update('pages', Math.max(1, Number(e.target.value||1)))} className="mt-1 block w-full rounded border px-3 py-2"/>
        </label>

        <label><span className="text-xs">Tipo de Redação</span>
          <select value={form.style} onChange={e => update('style', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
            <option value="argumentacao">Argumentação</option>
            <option value="persuasao">Persuasão</option>
            <option value="reflexivo">Reflexivo</option>
            <option value="normativo">Normativo</option>
          </select>
        </label>

        <label className="sm:col-span-2"><span className="text-xs">Metodologia</span>
          <select value={form.methodology} onChange={e => update('methodology', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
            <option value="qualitativa">Qualitativa</option>
            <option value="quantitativa">Quantitativa</option>
            <option value="mista">Mista</option>
          </select>
        </label>

        <label className="sm:col-span-2"><span className="text-xs">Área</span>
          <input value={form.area} onChange={e => update('area', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" placeholder="Ex.: Educação, Electrónica..." />
        </label>

        {form.serviceType === 'projeto-eletronica' && (
          <label><span className="text-xs">Complexidade</span>
          <select value={form.electronicsComplexity} onChange={e => update('electronicsComplexity', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
            <option value="basico">Básico</option>
            <option value="medio">Médio</option>
            <option value="complexo">Complexo</option>
          </select>
          </label>
        )}

        <label><span className="text-xs">Prazo (dias)</span>
          <input value={form.urgencyDays} onChange={e => update('urgencyDays', Math.max(1, Number(e.target.value||1)))} className="mt-1 block w-full rounded border px-3 py-2" type="number"/>
        </label>

        <label className="flex items-center gap-2"><input type="checkbox" checked={form.urgent} onChange={e => update('urgent', e.target.checked)} /> <span className="text-xs">Urgente</span></label>

        <label className="sm:col-span-2"><span className="text-xs">Informações adicionais</span>
          <textarea value={form.extraInfo} onChange={e => update('extraInfo', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" rows="3"></textarea>
        </label>

        <label><span className="text-xs">Email</span>
          <input value={form.email} onChange={e => update('email', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" type="email" placeholder="seu@exemplo.com"/>
        </label>

        <label><span className="text-xs">WhatsApp</span>
          <input value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" placeholder="+258 8XX XXX XXX"/>
        </label>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="w-full sm:w-1/2">{estimating ? <div className="p-2 bg-gray-50 rounded">A calcular...</div> : <PricePreview price={price} />}</div>
        <div className="w-full sm:w-auto">
          <button disabled={creating} className="w-full sm:w-auto bg-brand text-white px-4 py-2 rounded">
            {creating ? 'A criar...' : 'Gerar Encomenda & Invoice'}
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Ao criar a encomenda receberá uma referência e um recibo (PDF) com instruções para transferência.
      </div>
    </form>
  );
}
