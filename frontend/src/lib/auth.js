// frontend/src/lib/auth.js
export function saveToken(token) {
  localStorage.setItem('token', token);
}
export function getToken() {
  return localStorage.getItem('token');
}
export function removeToken() {
  localStorage.removeItem('token');
}

export function saveUser(user) {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch(e){}
}
export function getUser() {
  try {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  } catch(e){
    return null;
  }
}
export function logout() {
  removeToken();
  try { localStorage.removeItem('user'); } catch(e){}
  window.location.href = '/login';
}
