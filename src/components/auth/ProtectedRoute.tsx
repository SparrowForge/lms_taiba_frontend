'use client';

import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

import {useAuth} from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading AND not authenticated
    // This prevents the flash redirect when auth state is still loading
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading while checking authentication
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <Spin size="large" />
  //     </div>
  //   )
  // }

  // // Don't render children if not authenticated
  // if (!isAuthenticated) {
  //   return null
  // }

  return <>{children}</>;
};
