"use client";

import { useEffect } from 'react';
import useAuth from './useAuth';

export const useAuthDebug = () => {
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    console.log('Auth Debug:', {
      isAuthenticated,
      user: user ? { id: user.id, nome: user.nome, username: user.username } : null,
      loading,
      token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, user, loading]);

  return { isAuthenticated, user, loading };
};