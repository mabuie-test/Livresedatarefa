const KEY = 'livresedatarefa_logs';
export function pushLog(e){ try{ const arr = JSON.parse(localStorage.getItem(KEY) || '[]'); arr.unshift({ ts: new Date().toISOString(), ...e }); if (arr.length>200) arr.length=200; localStorage.setItem(KEY, JSON.stringify(arr)); }catch(err){console.error(err);} }
export function getLogs(){ return JSON.parse(localStorage.getItem(KEY) || '[]'); }
export function clearLogs(){ localStorage.removeItem(KEY); }
