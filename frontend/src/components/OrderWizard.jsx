// frontend/src/components/OrderWizard.jsx
import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import PricePreview from './PricePreview';

export default function OrderWizard() {
  const [form, setForm] = useState({
    serviceType: 'redacao',
    academicLevel: 'licenciatura',
    pages: 5,
    style: 'argumentacao',
    methodology: 'qualitativa',
    area: '',
    urgencyDays: 7,
    urgent: false,
    extraInfo: ''
  });
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function estimate() {
      try {
        const res = await api.post('/api/orders/estimate', form);
        if (mounted) setPrice(res.data);
      } catch (err) {
        // console.error(err);
        if (mounted) setPrice(null);
      }
    }
    estimate();
    return () => { mounted = false; };
  }, [form]);

  function update(key, value) {
    setForm(s => ({ ...s, [key]: value }));
  }

  async function handleCreateOrder(e) {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/orders', form);
      alert(`Encomenda criada: ${res.data.order.reference}`);
      // redirecionar para dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      alert('Erro ao criar encomenda: ' + msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Formulário de Encomenda</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span>Serviço</span>
          <select
            value={form.serviceType}
            onChange={e => update('serviceType', e.target.value)}
            className="mt-1 block w-full"
          >
            <option value="redacao">Redação</option>
            <option value="consultoria">Consultoria</option>
            <option value="projeto-eletronica">Projeto Eletrónica/Elétrica</option>
          </select>
        </label>

        <label className="block">
          <span>Nível académico</span>
          <select
            value={form.academicLevel}
            onChange={e => update('academicLevel', e.target.value)}
            className="mt-1 block w-full"
          >
            <option value="secundario">Secundário</option>
            <option value="licenciatura">Licenciatura</option>
            <option value="mestrado">Mestrado</option>
            <option value="doutoramento">Doutoramento</option>
          </select>
        </label>

        <label className="block">
          <span>Páginas</span>
          <input
            type="number"
            min="1"
            value={form.pages}
            onChange={e => update('pages', Number(e.target.value || 1))}
            className="mt-1 block w-full"
          />
        </label>

        <label className="block">
          <span>Tipo de Redação</span>
          <select
            value={form.style}
            onChange={e => update('style', e.target.value)}
            className="mt-1 block w-full"
          >
            <option value="argumentacao">Argumentação</option>
            <option value="persuasao">Persuasão</option>
            <option value="reflexivo">Reflexivo</option>
          </select>
        </label>

        <label className="block col-span-1 md:col-span-2">
          <span>Metodologia</span>
          <select
            value={form.methodology}
            onChange={e => update('methodology', e.target.value)}
            className="mt-1 block w-full"
          >
            <option value="qualitativa">Qualitativa</option>
            <option value="quantitativa">Quantitativa</option>
            <option value="mista">Mista</option>
          </select>
        </label>

        <label className="block col-span-1 md:col-span-2">
          <span>Área de pesquisa</span>
          <input
            value={form.area}
            onChange={e => update('area', e.target.value)}
            className="mt-1 block w-full"
          />
        </label>

        <label className="block">
          <span>Prazo (dias)</span>
          <input
            type="number"
            min="1"
            value={form.urgencyDays}
            onChange={e => update('urgencyDays', Number(e.target.value || 1))}
            className="mt-1 block w-full"
          />
        </label>

        <label className="block flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.urgent}
            onChange={e => update('urgent', e.target.checked)}
            className="mt-1"
          />
          <span>Urgente (aplicar sobretaxa)</span>
        </label>

        <label className="block col-span-1 md:col-span-2">
          <span>Informações adicionais</span>
          <textarea
            value={form.extraInfo}
            onChange={e => update('extraInfo', e.target.value)}
            className="mt-1 block w-full"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full md:w-1/2">
          <PricePreview price={price} />
        </div>

        <div className="w-full md:w-auto">
          <button
            onClick={handleCreateOrder}
            disabled={loading}
            className="bg-brand text-white px-4 py-2 rounded-lg shadow"
          >
            {loading ? 'A criar...' : 'Gerar Encomenda & Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
}
