// frontend/src/components/OrderWizard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import PricePreview from './PricePreview';

export default function OrderWizard() {
  const navigate = useNavigate();
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
    // para projectos de electrónica/eléctrica
    electronicsComplexity: 'basico' // basico, medio, complexo
  });

  const [price, setPrice] = useState(null);
  const [estimating, setEstimating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  // atualiza um campo do form
  function update(key, value) {
    setForm(s => ({ ...s, [key]: value }));
  }

  // validação simples antes de criar a encomenda
  function validateBeforeCreate() {
    if (!form.email && !localStorage.getItem('token')) {
      setError('Por favor insira um email ou faça login antes de criar a encomenda.');
      return false;
    }
    if (!form.whatsapp && !localStorage.getItem('token')) {
      setError('Por favor insira um número de WhatsApp ou faça login antes de criar a encomenda.');
      return false;
    }
    if (!form.area) {
      setError('Por favor indique a área de pesquisa/projeto.');
      return false;
    }
    if (!form.pages || form.pages < 1) {
      setError('Defina o número de páginas (mínimo 1).');
      return false;
    }
    return true;
  }

  // estima preço com debounce para evitar muitos requests
  useEffect(() => {
    setError('');
    setEstimating(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const payload = {
          serviceType: form.serviceType,
          academicLevel: form.academicLevel,
          pages: Number(form.pages) || 1,
          style: form.style,
          methodology: form.methodology,
          urgencyDays: Number(form.urgencyDays) || 7,
          urgent: !!form.urgent,
          extras: form.serviceType === 'projeto-eletronica'
            ? (form.electronicsComplexity === 'medio' ? 500 : form.electronicsComplexity === 'complexo' ? 1200 : 0)
            : 0
        };
        const res = await api.post('/api/orders/estimate', payload);
        setPrice(res.data);
      } catch (err) {
        // se falhar, limpa preview mas não bloqueia UI
        setPrice(null);
      } finally {
        setEstimating(false);
      }
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.serviceType,
    form.academicLevel,
    form.pages,
    form.style,
    form.methodology,
    form.urgencyDays,
    form.urgent,
    form.electronicsComplexity
  ]);

  // criar a encomenda (chamada ao backend)
  async function handleCreateOrder(e) {
    e?.preventDefault();
    setError('');
    if (!validateBeforeCreate()) return;

    setCreating(true);
    try {
      // payload completo para criar order
      const payload = {
        serviceType: form.serviceType,
        academicLevel: form.academicLevel,
        pages: Number(form.pages) || 1,
        style: form.style,
        methodology: form.methodology,
        area: form.area,
        extraInfo: form.extraInfo,
        urgencyDays: Number(form.urgencyDays) || 7,
        urgent: !!form.urgent,
        email: form.email,
        whatsapp: form.whatsapp,
        // incluir extras para projetos eletrónicos
        electronicsComplexity: form.serviceType === 'projeto-eletronica' ? form.electronicsComplexity : undefined
      };

      const res = await api.post('/api/orders', payload);
      const order = res.data.order;
      alert(`Encomenda criada com referência ${order.reference}. Verifique o recibo e faça a transferência.`);
      // redireciona para o dashboard / detalhe do pedido
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Erro ao criar encomenda';
      setError(msg);
    } finally {
      setCreating(false);
    }
  }

  return (
    <form onSubmit={handleCreateOrder} className="bg-white rounded-lg shadow p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Formulário de Encomenda</h2>

      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm">Serviço</span>
          <select value={form.serviceType} onChange={e => update('serviceType', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
            <option value="redacao">Redação</option>
            <option value="consultoria">Consultoria</option>
            <option value="projeto-eletronica">Projeto Electrónica/Elétrica</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm">Nível académico</span>
          <select value={form.academicLevel} onChange={e => update('academicLevel', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
            <option value="secundario">Secundário</option>
            <option value="licenciatura">Licenciatura</option>
            <option value="mestrado">Mestrado</option>
            <option value="doutoramento">Doutoramento</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm">Páginas</span>
          <input type="number" min="1" value={form.pages} onChange={e => update('pages', Math.max(1, Number(e.target.value || 1)))} className="mt-1 block w-full rounded border px-3 py-2" />
        </label>

        <label className="block">
          <span className="text-sm">Tipo de Redação</span>
          <select value={form.style} onChange={e => update('style', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
            <option value="argumentacao">Argumentação</option>
            <option value="persuasao">Persuasão</option>
            <option value="reflexivo">Reflexivo</option>
            <option value="normativo">Normativo</option>
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm">Metodologia</span>
          <select value={form.methodology} onChange={e => update('methodology', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
            <option value="qualitativa">Qualitativa</option>
            <option value="quantitativa">Quantitativa</option>
            <option value="mista">Mista</option>
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm">Área de pesquisa / disciplina</span>
          <input value={form.area} onChange={e => update('area', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" placeholder="Ex.: Educação, Electrónica, Engenharia eléctrica..." />
        </label>

        {form.serviceType === 'projeto-eletronica' && (
          <label className="block">
            <span className="text-sm">Complexidade do projecto (electrónica)</span>
            <select value={form.electronicsComplexity} onChange={e => update('electronicsComplexity', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
              <option value="basico">Básico (documentação + esquemas simples)</option>
              <option value="medio">Médio (simulações + PCB simples)</option>
              <option value="complexo">Complexo (PCB avançado + firmware)</option>
            </select>
          </label>
        )}

        <label className="block md:col-span-2">
          <span className="text-sm">Informações adicionais</span>
          <textarea value={form.extraInfo} onChange={e => update('extraInfo', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" rows="3" placeholder="Instruções, referências, anexos (descreva)..." />
        </label>

        <label className="block">
          <span className="text-sm">Prazo (dias)</span>
          <input type="number" min="1" value={form.urgencyDays} onChange={e => update('urgencyDays', Math.max(1, Number(e.target.value || 1)))} className="mt-1 block w-full rounded border px-3 py-2" />
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.urgent} onChange={e => update('urgent', e.target.checked)} className="mt-1" />
          <span className="text-sm">Marcar como urgente (sobretaxa)</span>
        </label>

        <label className="block">
          <span className="text-sm">Email de contacto</span>
          <input value={form.email} onChange={e => update('email', e.target.value)} type="email" className="mt-1 block w-full rounded border px-3 py-2" placeholder="seu@exemplo.com" />
        </label>

        <label className="block">
          <span className="text-sm">WhatsApp (n.º para contacto)</span>
          <input value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" placeholder="+258 8XX XXX XXX" />
        </label>
      </div>

      {/* resumo e ações */}
      <div className="mt-6 flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="w-full md:w-1/2">
          {estimating ? (
            <div className="p-3 rounded bg-gray-50 text-sm">A calcular preço...</div>
          ) : (
            <PricePreview price={price} />
          )}
        </div>

        <div className="w-full md:w-auto">
          <button type="submit" disabled={creating} className="w-full md:w-auto bg-brand text-white px-4 py-3 rounded-lg shadow">
            {creating ? 'A criar encomenda...' : 'Gerar Encomenda & Invoice'}
          </button>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Ao criar a encomenda será gerada uma referência e um recibo (PDF) com instruções para transferência Mpesa/Emola.
      </div>
    </form>
  );
}
