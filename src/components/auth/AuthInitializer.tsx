'use client';

import {useEffect} from 'react';

import {useAuth} from '@/hooks/useAuth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const { initializeAuth } = useAuth();

  // Initialize auth state once at app startup
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};
