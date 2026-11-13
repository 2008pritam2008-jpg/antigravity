// client/src/api/client.js
import axios from 'axios';
import { api } from './endpoints.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agri_auth_token') || 'demo-token-farmer-001';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Format API responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorPayload = error.response?.data || {
      success: false,
      message: error.message || 'Network request failed',
      error: { code: 'NETWORK_ERROR', details: [] },
    };
    return Promise.reject(errorPayload);
  }
);

export { api };
export default api;
