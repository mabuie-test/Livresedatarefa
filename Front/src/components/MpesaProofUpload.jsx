import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react';
import api from '../lib/api.js';
import { pushLog } from '../lib/errorLogger.js';

export default function MpesaProofUpload({ orderId, onUploaded }){
  const [file, setFile] = useState(null);
  const [mpesaRef, setMpesaRef] = useState('');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e){
    e?.preventDefault();
    if (!file) { setMsg('Selecione um ficheiro'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('proof', file);
      fd.append('mpesaReference', mpesaRef);
      fd.append('amount', amount);
      const res = await api.post(`/api/orders/${orderId}/mpesa-proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setMsg('Comprovativo enviado. Aguarde confirmação.');
      if (onUploaded) onUploaded(res.data.order);
    } catch (err) {
      pushLog({ type: 'mpesa_proof_upload_failed', orderId, error: err.message });
      setMsg('Erro no envio. Veja /debug para logs.');
    } finally { setLoading(false); }
  }

  return (
    <Box bg="white" p={3} borderRadius="md" boxShadow="sm">
      <form onSubmit={handleSubmit}>
        <FormControl><FormLabel>Comprovativo (jpg/png/pdf)</FormLabel><Input type="file" accept=".jpg,.png,.pdf" onChange={e=>setFile(e.target.files[0])} /></FormControl>
        <FormControl mt={2}><FormLabel>Referência Mpesa</FormLabel><Input value={mpesaRef} onChange={e=>setMpesaRef(e.target.value)} /></FormControl>
        <FormControl mt={2}><FormLabel>Valor (MZN)</FormLabel><Input value={amount} onChange={e=>setAmount(e.target.value)} /></FormControl>
        <Button mt={3} colorScheme="purple" type="submit" isLoading={loading}>Enviar comprovativo</Button>
        {msg && <Text mt={2} color="gray.600">{msg}</Text>}
      </form>
    </Box>
  );
}
