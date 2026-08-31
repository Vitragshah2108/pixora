// lib/api.js
import axios from 'axios';

export const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_API) {
    return process.env.NEXT_PUBLIC_BACKEND_API;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }
  return 'https://backend-blush-ten-49.vercel.app';
};

export const BACKEND_API = getBackendUrl();

// Base axios instance without auth headers
export const api = axios.create({
  baseURL: BACKEND_API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For server-side usage (Server Components, Route Handlers, Server Actions)
export const serverApi = axios.create({
  baseURL: BACKEND_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update baseURL dynamically and attach auth token from localStorage if present
api.interceptors.request.use((config) => {
  config.baseURL = getBackendUrl();
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});