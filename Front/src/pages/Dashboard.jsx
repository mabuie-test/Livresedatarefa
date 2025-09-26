import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Text, Button } from '@chakra-ui/react';
import api from '../lib/api.js';

export default function Dashboard(){
  const [orders, setOrders] = useState([]);
  useEffect(()=> {
    async function load(){ try { const res = await api.get('/api/orders'); setOrders(res.data.orders || []); } catch(e){ console.error(e); } }
    load();
  }, []);

  return (
    <Box>
      <Heading size="md" mb={4}>Meus Pedidos</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
        {orders.length === 0 && <Box p={4} bg="white" borderRadius="md">Nenhum pedido encontrado.</Box>}
        {orders.map(o => (
          <Box key={o._id} p={3} bg="white" borderRadius="md" boxShadow="sm">
            <Text fontSize="sm" color="gray.500">Ref: {o.reference}</Text>
            <Text fontWeight="semibold">{o.serviceType} — {o.academicLevel}</Text>
            <Text fontSize="sm">Páginas: {o.pages} • Total: {o.totalPriceMZN} MZN</Text>
            <Button mt={3} size="sm" colorScheme="purple" onClick={()=> window.location.href = `/orders/${o._id}`}>Ver pedido</Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
