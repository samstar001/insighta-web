import axios from 'axios';

// Empty baseURL = all requests go through Vite proxy (dev) or Vercel rewrites (prod)
const client = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'x-api-version': '1',
  }
});

// Response interceptor — handle token expiry globally
client.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;

    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Try to refresh using the HTTP-only cookie
        await client.post('/auth/refresh-cookie');
        return client(original);
      } catch {
        // Refresh failed — redirect to login
        window.location.href = '/';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────
export const getMe = () =>
  client.get('/auth/me');

export const logout = () =>
  client.post('/auth/logout-cookie');

// ── Profiles ──────────────────────────────────────────────────────
export const getProfiles = (params = {}) =>
  client.get('/api/profiles', { params });

export const getProfile = (id) =>
  client.get(`/api/profiles/${id}`);

export const searchProfiles = (q, page = 1, limit = 10) =>
  client.get('/api/profiles/search', { params: { q, page, limit } });

export const createProfile = (name) =>
  client.post('/api/profiles', { name });

export const deleteProfile = (id) =>
  client.delete(`/api/profiles/${id}`);

export const exportProfiles = (params = {}) =>
  client.get('/api/profiles/export', {
    params: { ...params, format: 'csv' },
    responseType: 'blob'
  });