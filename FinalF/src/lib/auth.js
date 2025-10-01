export function saveToken(token){ localStorage.setItem('token', token); }
export function getToken(){ return localStorage.getItem('token'); }
export function logout(){ localStorage.removeItem('token'); window.location.href = '/login'; }
export function getUserFromToken(){
  try {
    const t = getToken(); if(!t) return null;
    const p = JSON.parse(atob(t.split('.')[1])); return p;
  } catch(e){ return null; }
}
