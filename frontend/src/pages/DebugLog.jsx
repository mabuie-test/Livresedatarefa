// frontend/src/pages/DebugLog.jsx
import React, { useState, useEffect } from 'react';
import { getLogs, clearLogs } from '../lib/errorLogger';
import api from '../lib/api';

export default function DebugLog() {
  const [logs, setLogs] = useState([]);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => setLogs(getLogs()), []);

  async function handleSend() {
    if (logs.length === 0) { setMsg('Nenhum log para enviar'); return; }
    setSending(true);
    try {
      await api.post('/api/logs', { logs });
      setMsg('Logs enviados com sucesso');
      clearLogs();
      setLogs([]);
    } catch (err) {
      setMsg('Falha ao enviar logs: ' + (err.response?.data?.error || err.message));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Debug / Registo de Erros</h2>
      <div className="mb-3 text-sm text-gray-600">Últimos {logs.length} eventos — útil em mobile.</div>

      <div className="space-y-2 max-h-64 overflow-auto mb-3">
        {logs.map((l, i) => (
          <pre key={i} className="bg-gray-50 p-2 rounded text-xs">
            {JSON.stringify(l, null, 2)}
          </pre>
        ))}
        {logs.length === 0 && <div className="text-sm text-gray-500">Sem logs.</div>}
      </div>

      <div className="flex gap-2">
        <button onClick={handleSend} className="bg-brand text-white px-3 py-2 rounded" disabled={sending}>
          {sending ? 'Enviando...' : 'Enviar logs ao servidor'}
        </button>
        <button onClick={() => { clearLogs(); setLogs([]); }} className="bg-gray-100 px-3 py-2 rounded">Limpar</button>
      </div>

      {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}
    </div>
  );
}
