import React from 'react';
import { HStack, Box, Image, Text, Button, Flex, Spacer } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Header(){
  return (
    <Box as="header" bg="white" px={4} py={3} boxShadow="sm" position="sticky" top="0" zIndex="40">
      <Flex align="center" maxW="1200px" mx="auto">
        <HStack spacing={3}>
          <Image src={logo} boxSize="10" alt="Livresedatarefa" />
          <Box>
            <Text fontWeight="bold" color="brand.500">Livresedatarefa</Text>
            <Text fontSize="xs" color="gray.500">Trabalhos com liberdade. Pesquisa com rigor.</Text>
          </Box>
        </HStack>
        <Spacer />
        <HStack spacing={3}>
          <Link to="/dashboard"><Button variant="ghost" size="sm">Minha Conta</Button></Link>
          <Link to="/admin"><Button variant="ghost" size="sm">Admin</Button></Link>
          <Link to="/debug"><Button variant="ghost" size="sm">Debug</Button></Link>
          <Link to="/login"><Button colorScheme="purple" size="sm">Entrar</Button></Link>
        </HStack>
      </Flex>
    </Box>
  );
}
