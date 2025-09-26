import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import api, { API } from '../lib/api.js';
import MpesaProofUploadGuest from '../components/MpesaProofUploadGuest.jsx';

export default function GuestOrderDetail(){
  const { reference } = useParams();
  const [qs] = useSearchParams();
  const email = qs.get('email') || '';
  const [order, setOrder] = useState(null);

  useEffect(()=> {
    async function load(){ if(!email) { alert('Email necessario'); return; }
      try { const res = await api.get(`/api/orders/guest/${reference}?email=${encodeURIComponent(email)}`); setOrder(res.data.order); } 
      catch (err) { alert(err.response?.data?.error || err.message); }
    }
    load();
  }, [reference, email]);

  if(!order) return <Box>Carregando...</Box>;

  const invoiceUrl = order.invoiceFileId ? `${API}/api/files/${order.invoiceFileId}` : null;

  return (
    <Box bg="white" p={4} borderRadius="md">
      <Heading size="md" mb={2}>Pedido {order.reference}</Heading>
      <Text>Total: {order.totalPriceMZN} MZN</Text>
      {invoiceUrl ? <Button mt={3} colorScheme="purple" onClick={()=> window.open(invoiceUrl,'_blank')}>Abrir Recibo</Button> : <Text>Recibo não disponível</Text>}
      <Box mt={4}><MpesaProofUploadGuest reference={order.reference} email={order.guestEmail} /></Box>
    </Box>
  );
}
