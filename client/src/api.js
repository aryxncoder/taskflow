import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadSession = Boolean(localStorage.getItem('token'));
    if (error.response?.status === 401 && hadSession) {
      localStorage.removeItem('token');
      window.dispatchEvent(
        new CustomEvent('auth:expired', { detail: error.response.data?.message })
      );
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.request) return 'Cannot reach the server. Check your connection and try again.';
  return 'Something went wrong. Please try again.';
}

export default api;
