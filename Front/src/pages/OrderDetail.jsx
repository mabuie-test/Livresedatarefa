import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import api, { API } from '../lib/api.js';
import MpesaProofUpload from '../components/MpesaProofUpload.jsx';

export default function OrderDetail(){
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(()=> {
    async function load(){ try { const res = await api.get(`/api/orders/${id}`); setOrder(res.data.order); } catch (err) { alert(err.response?.data?.error || err.message); } }
    load();
  }, [id]);

  if(!order) return <Box>Carregando...</Box>;

  const invoiceUrl = order.invoiceFileId ? `${API}/api/files/${order.invoiceFileId}` : null;
  const adminFileUrl = order.adminFileId ? `${API}/api/files/${order.adminFileId}` : null;

  return (
    <Box bg="white" p={4} borderRadius="md">
      <Heading size="md" mb={2}>Pedido {order.reference}</Heading>
      <Text>Total: {order.totalPriceMZN} MZN</Text>
      {invoiceUrl ? <Button mt={3} colorScheme="purple" onClick={()=> window.open(invoiceUrl,'_blank')}>Abrir Recibo</Button> : <Text>Recibo não disponível</Text>}
      <Box mt={4}><MpesaProofUpload orderId={order._id} onUploaded={(o)=>setOrder(o)} /></Box>
      {adminFileUrl && <Button mt={3} colorScheme="orange" onClick={()=> window.open(adminFileUrl,'_blank')}>Baixar Ficheiro Final</Button>}
    </Box>
  );
}
