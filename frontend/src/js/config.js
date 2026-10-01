/**
 * Centralized API configuration for the Honatu frontend.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic fetch wrapper for the Honatu backend.
 * - Prefixes the path with API_BASE_URL
 * - Attaches Authorization header when a token exists
 * - Clears session on 401 and notifies listeners
 */
export async function apiFetch(path, options = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  const token = localStorage.getItem('honatu_token');

  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('honatu_token');
    localStorage.removeItem('honatu-auth');
    localStorage.removeItem('honatu-auth-role');
    localStorage.removeItem('honatu-auth-user');
    window.dispatchEvent(new CustomEvent('honatu:session:expired'));
  }

  return response;
}
