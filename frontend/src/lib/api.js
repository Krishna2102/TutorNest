export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token') || '';

export async function apiRequest(path, { method = 'GET', body, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  const token = getAuthToken();
  if (token) {
    opts.headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, opts);
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = isJson ? (data?.error || data?.message || 'Request failed') : (data || 'Request failed');
    throw new Error(message);
  }
  return data;
}
