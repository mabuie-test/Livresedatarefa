import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';

export default function PricePreview({ price }){
  if(!price) return <Box p={3} bg="gray.50" borderRadius="md">Preço indisponível</Box>;
  return (
    <Box p={3} bg="gray.50" borderRadius="md">
      <VStack align="stretch" spacing={1}>
        <HStack justify="space-between"><Text fontSize="sm" color="gray.600">Base</Text><Text fontWeight="semibold">{price.basePriceMZN} MZN</Text></HStack>
        {price.urgencySurchargeMZN > 0 && (<HStack justify="space-between"><Text fontSize="sm" color="red.500">Urgência</Text><Text>+{price.urgencySurchargeMZN} MZN</Text></HStack>)}
        <HStack justify="space-between"><Text fontSize="md">Total</Text><Text fontSize="lg" fontWeight="bold">{price.totalPriceMZN} MZN</Text></HStack>
      </VStack>
    </Box>
  );
}
