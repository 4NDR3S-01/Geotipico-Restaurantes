// API de autenticación
const API_URL = process.env.REACT_APP_API_URL || '';

export async function register({ firstName, lastName, email, password }) {
  const res = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al registrar');
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
  return data;
}

export async function forgotPassword(email) {
  const res = await fetch('/api/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error('Error al solicitar recuperación');
  return res.json();
}

export async function resetPassword(token, password) {
  const res = await fetch('/api/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });
  if (!res.ok) throw new Error('Error al restablecer contraseña');
  return res.json();
} 