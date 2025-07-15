// API de contacto
const API_URL = process.env.REACT_APP_API_URL || '';

export async function sendContact({ name, email, subject, message }) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, subject, message })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al enviar mensaje');
  return data;
} 