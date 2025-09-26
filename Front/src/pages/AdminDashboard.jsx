import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Text, Button } from '@chakra-ui/react';
import api from '../lib/api.js';

export default function AdminDashboard(){
  const [orders, setOrders] = useState([]);

  useEffect(()=> {
    async function load(){ try { const res = await api.get('/api/admin/orders'); setOrders(res.data.orders || []); } catch (err) { console.error(err); } }
    load();
  }, []);

  return (
    <Box>
      <Heading size="md" mb={4}>Painel Admin</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
        {orders.length === 0 && <Box p={4} bg="white" borderRadius="md">Nenhum pedido (ou sem permissão).</Box>}
        {orders.map(o => (
          <Box key={o._id} p={3} bg="white" borderRadius="md" boxShadow="sm">
            <Text fontWeight="semibold">{o.reference} — {o.serviceType}</Text>
            <Text fontSize="sm">{o.guestEmail || o.userId} • {o.totalPriceMZN} MZN</Text>
            <Button mt={3} size="sm" colorScheme="green" onClick={async ()=>{
              await api.post(`/api/admin/orders/${o._id}/confirm-payment`);
              alert('Pagamento confirmado');
            }}>Confirmar Pagamento</Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
