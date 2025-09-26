import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react';
import api from '../lib/api.js';
import { pushLog } from '../lib/errorLogger.js';

export default function MpesaProofUploadGuest({ reference, email }){
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
      fd.append('email', email);
      await api.post(`/api/orders/guest/${encodeURIComponent(reference)}/mpesa-proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setMsg('Comprovativo enviado. Aguarde confirmação.');
    } catch (err) {
      pushLog({ type: 'guest_mpesa_upload_failed', reference, email, error: err.message });
      setMsg('Erro no envio. Veja /debug para logs.');
    } finally { setLoading(false); }
  }

  return (
    <Box bg="white" p={3} borderRadius="md" boxShadow="sm">
      <form onSubmit={handleSubmit}>
        <FormControl><FormLabel>Comprovativo</FormLabel><Input type="file" accept=".jpg,.png,.pdf" onChange={e=>setFile(e.target.files[0])} /></FormControl>
        <FormControl mt={2}><FormLabel>Referência Mpesa</FormLabel><Input value={mpesaRef} onChange={e=>setMpesaRef(e.target.value)} /></FormControl>
        <FormControl mt={2}><FormLabel>Valor (MZN)</FormLabel><Input value={amount} onChange={e=>setAmount(e.target.value)} /></FormControl>
        <Button mt={3} colorScheme="purple" type="submit" isLoading={loading}>Enviar</Button>
        {msg && <Text mt={2}>{msg}</Text>}
      </form>
    </Box>
  );
}
