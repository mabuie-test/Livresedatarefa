import React, { useState, useEffect } from 'react';
import { getLogs, clearLogs } from '../lib/errorLogger';
import api from '../lib/api';

export default function DebugLog(){
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState('');
  useEffect(()=> setLogs(getLogs()), []);
  async function send(){ 
    if (!logs.length) { setMsg('Sem logs'); return; }
    setMsg('Enviando...');
    try { await api.post('/api/logs', { logs }); setMsg('Enviado com sucesso'); clearLogs(); setLogs([]); } 
    catch (err) { setMsg('Falha ao enviar: ' + (err.response?.data?.error || err.message)); }
  }
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Debug / Registos</h2>
      <div className="max-h-64 overflow-auto mb-3 space-y-2">
        {logs.length ? logs.map((l,i)=>(<pre key={i} className="bg-gray-50 p-2 text-xs rounded">{JSON.stringify(l,null,2)}</pre>)) : <div className="text-sm text-gray-500">Sem logs</div>}
      </div>
      <div className="flex gap-2"><button onClick={send} className="bg-brand text-white px-3 py-2 rounded">Enviar logs ao servidor</button><button onClick={()=>{clearLogs(); setLogs([])}} className="bg-gray-100 px-3 py-2 rounded">Limpar</button></div>
      {msg && <div className="mt-3 text-sm">{msg}</div>}
    </div>
  );
}
