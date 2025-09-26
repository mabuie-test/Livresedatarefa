import React, { useEffect, useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { getLogs, clearLogs } from '../lib/errorLogger.js';
import api from '../lib/api.js';

export default function DebugLog(){
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState('');
  useEffect(()=> setLogs(getLogs()), []);

  async function send(){
    if (!logs.length) { setMsg('Sem logs'); return; }
    setMsg('Enviando...');
    try {
      await api.post('/api/logs', { logs });
      setMsg('Enviado com sucesso');
      clearLogs(); setLogs([]);
    } catch (err) {
      setMsg('Falha ao enviar: ' + (err.response?.data?.error || err.message));
    }
  }

  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
      <Text fontWeight="semibold">Debug / Registos</Text>
      <Box mt={3} maxH="320px" overflowY="auto" bg="gray.50" p={2} borderRadius="sm">
        {logs.length ? logs.map((l,i)=>(<pre key={i} style={{fontSize:12}}>{JSON.stringify(l,null,2)}</pre>)) : <Text color="gray.500">Sem logs</Text>}
      </Box>
      <Button mt={3} colorScheme="purple" onClick={send} mr={2}>Enviar logs</Button>
      <Button mt={3} onClick={()=>{ clearLogs(); setLogs([]); setMsg('Limpo'); }}>Limpar</Button>
      {msg && <Text mt={2}>{msg}</Text>}
    </Box>
  );
}
