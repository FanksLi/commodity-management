import axios, { AxiosError, AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api };
export type { AxiosError };