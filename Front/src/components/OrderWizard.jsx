import React, { useState, useEffect, useRef } from 'react';
import { Box, SimpleGrid, FormControl, FormLabel, Select, Input, NumberInput, NumberInputField, Textarea, Checkbox, Button, useToast } from '@chakra-ui/react';
import api from '../lib/api.js';
import PricePreview from './PricePreview.jsx';
import { getToken } from '../lib/auth.js';

export default function OrderWizard(){
  const toast = useToast();
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
  const debounceRef = useRef(null);

  function update(key, value){ setForm(s => ({ ...s, [key]: value })); }

  useEffect(() => {
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
          extras: form.serviceType === 'projeto-eletronica' ? (form.electronicsComplexity === 'medio' ? 500 : form.electronicsComplexity === 'complexo' ? 1200 : 0) : 0
        };
        const res = await api.post('/api/orders/estimate', payload);
        setPrice(res.data);
      } catch (err) {
        setPrice(null);
      } finally {
        setEstimating(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [form.serviceType, form.academicLevel, form.pages, form.style, form.methodology, form.urgencyDays, form.urgent, form.electronicsComplexity]);

  function validate(){
    if (!form.area) { toast({ title: 'Indique a área', status: 'warning' }); return false; }
    if (!form.pages || form.pages < 1) { toast({ title: 'Nº páginas inválido', status: 'warning' }); return false; }
    if (!form.email && !getToken()) { toast({ title: 'Insira email ou faça login', status: 'warning' }); return false; }
    return true;
  }

  async function handleCreate(e){
    e?.preventDefault();
    if (!validate()) return;
    setCreating(true);
    try {
      const payload = {...form, pages: Number(form.pages)||1};
      let res;
      if (getToken()) {
        res = await api.post('/api/orders', payload);
        const order = res.data.order;
        toast({ title: `Encomenda criada: ${order.reference}`, status: 'success' });
        window.location.href = `/orders/${order._id}`;
      } else {
        res = await api.post('/api/orders/guest', payload);
        const order = res.data.order;
        toast({ title: `Encomenda criada (guest): ${order.reference}`, status: 'success' });
        window.location.href = `/orders/guest/${encodeURIComponent(order.reference)}?email=${encodeURIComponent(form.email)}`;
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Erro';
      toast({ title: msg, status: 'error' });
    } finally { setCreating(false); }
  }

  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
      <form onSubmit={handleCreate}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <FormControl><FormLabel>Serviço</FormLabel>
            <Select value={form.serviceType} onChange={e => update('serviceType', e.target.value)}>
              <option value="redacao">Redação</option>
              <option value="consultoria">Consultoria</option>
              <option value="projeto-eletronica">Projeto Electrónica/Elétrica</option>
            </Select>
          </FormControl>

          <FormControl><FormLabel>Nível académico</FormLabel>
            <Select value={form.academicLevel} onChange={e => update('academicLevel', e.target.value)}>
              <option value="secundario">Secundário</option>
              <option value="licenciatura">Licenciatura</option>
              <option value="mestrado">Mestrado</option>
              <option value="doutoramento">Doutoramento</option>
            </Select>
          </FormControl>

          <FormControl><FormLabel>Páginas</FormLabel>
            <NumberInput min={1} value={form.pages} onChange={(v) => update('pages', Number(v)||1)}><NumberInputField /></NumberInput>
          </FormControl>

          <FormControl><FormLabel>Tipo de Redação</FormLabel>
            <Select value={form.style} onChange={e => update('style', e.target.value)}>
              <option value="argumentacao">Argumentação</option>
              <option value="persuasao">Persuasão</option>
              <option value="reflexivo">Reflexivo</option>
              <option value="normativo">Normativo</option>
            </Select>
          </FormControl>

          <FormControl><FormLabel>Metodologia</FormLabel>
            <Select value={form.methodology} onChange={e => update('methodology', e.target.value)}>
              <option value="qualitativa">Qualitativa</option>
              <option value="quantitativa">Quantitativa</option>
              <option value="mista">Mista</option>
            </Select>
          </FormControl>

          <FormControl><FormLabel>Prazo (dias)</FormLabel>
            <NumberInput min={1} value={form.urgencyDays} onChange={(v)=>update('urgencyDays', Number(v)||1)}><NumberInputField /></NumberInput>
          </FormControl>

          <FormControl><FormLabel>Área de pesquisa</FormLabel>
            <Input value={form.area} onChange={e=>update('area', e.target.value)} placeholder="Ex.: Educação, Electrónica..." />
          </FormControl>

          {form.serviceType === 'projeto-eletronica' && (
            <FormControl><FormLabel>Complexidade (electrónica)</FormLabel>
              <Select value={form.electronicsComplexity} onChange={e => update('electronicsComplexity', e.target.value)}>
                <option value="basico">Básico</option>
                <option value="medio">Médio</option>
                <option value="complexo">Complexo</option>
              </Select>
            </FormControl>
          )}

          <FormControl><FormLabel>Informações adicionais</FormLabel>
            <Textarea value={form.extraInfo} onChange={e=>update('extraInfo', e.target.value)} rows={3} />
          </FormControl>

          <FormControl><FormLabel>Email de contacto</FormLabel>
            <Input value={form.email} onChange={e=>update('email', e.target.value)} placeholder="seu@exemplo.com" />
          </FormControl>

          <FormControl><FormLabel>WhatsApp</FormLabel>
            <Input value={form.whatsapp} onChange={e=>update('whatsapp', e.target.value)} placeholder="+258 8XX XXX XXX" />
          </FormControl>

          <FormControl><Checkbox isChecked={form.urgent} onChange={e => update('urgent', e.target.checked)}>Marcar como urgente (sobretaxa)</Checkbox></FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={4} alignItems="center">
          <Box>{estimating ? <Box p={3}>A calcular preço...</Box> : <PricePreview price={price} />}</Box>
          <Box textAlign={{ base: 'left', md: 'right' }}>
            <Button type="submit" colorScheme="purple" isLoading={creating}>{creating ? 'A criar...' : 'Gerar Encomenda & Invoice'}</Button>
          </Box>
        </SimpleGrid>

      </form>
    </Box>
  );
}
