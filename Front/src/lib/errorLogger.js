const KEY = 'livresedatarefa_logs';
export function pushLog(entry){
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    arr.unshift({ ts: new Date().toISOString(), ...entry });
    if (arr.length > 300) arr.length = 300;
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch(e){ console.error('log push fail', e); }
}
export function getLogs(){ return JSON.parse(localStorage.getItem(KEY) || '[]'); }
export function clearLogs(){ localStorage.removeItem(KEY); }
