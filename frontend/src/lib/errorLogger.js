// frontend/src/lib/errorLogger.js
const KEY = 'livresedatarefa_error_logs';
const MAX = 200;

export function pushLog(entry) {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({ ts: new Date().toISOString(), ...entry });
    if (arr.length > MAX) arr.length = MAX;
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch (err) {
    console.error('errorLogger push failed', err);
  }
}

export function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch (err) {
    return [];
  }
}

export function clearLogs() {
  localStorage.removeItem(KEY);
}
