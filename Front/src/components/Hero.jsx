import React from 'react';
import { Box, Heading, Text, Stack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function Hero(){
  return (
    <Box bg="brand.500" color="white" py={{ base: 8, md: 16 }} px={4}>
      <Stack maxW="1200px" mx="auto" direction={{ base: 'column', md: 'row' }} align="center" spacing={6}>
        <Box flex="1">
          <Heading size="lg">Livresedatarefa</Heading>
          <Text mt={3}>Encomende trabalhos académicos, consultoria e projectos — com instruções de pagamento Mpesa/Emola.</Text>
        </Box>
        <Box>
          <Link to="/"><Button bg="white" color="brand.500" _hover={{ bg: 'gray.50' }}>Comece agora</Button></Link>
        </Box>
      </Stack>
    </Box>
  );
}
