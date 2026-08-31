"use client";

import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';
import { useEffect } from 'react';

export const useApi = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const token = session?.backendToken || session?.user?.backendToken;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }

    const requestInterceptor = api.interceptors.request.use((config) => {
      const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
      if (activeToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${activeToken}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [session]);

  return api;
};