// frontend/src/lib/auth.js
export function saveToken(token){ localStorage.setItem('token', token); }
export function getToken(){ return localStorage.getItem('token'); }
export function logout(){ localStorage.removeItem('token'); window.location.href = '/login'; }

// decode jwt payload without external libs (safe for UI only; backend must still enforce)
export function getUserFromToken(){
  try {
    const t = getToken();
    if(!t) return null;
    const parts = t.split('.');
    if(parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload; // { id, email, role, ... }
  } catch(e){ return null; }
}
