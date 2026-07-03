import axios from 'axios';

const api = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env) ? (import.meta.env.VITE_API_URL || '/api/v1') : '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const storedAuth = localStorage.getItem('auth-storage');
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      const token = parsed?.state?.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Failed to parse auth token from localStorage', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem('auth-storage');
      } catch (e) {
        console.error('Failed to clear auth from localStorage', e);
      }
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
