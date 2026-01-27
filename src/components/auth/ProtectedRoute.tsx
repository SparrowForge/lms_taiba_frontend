'use client';

import { Spin } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useRouteAccess } from '@/hooks/useRouteAccess';
import { TwofaStatus } from '@/types/twofa';

import { AccessDenied } from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, isTwoFaVerified } = useAuth();
  const { isAccessible, isLoading: isRouteLoading } = useRouteAccess();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading || isRouteLoading) {
      return;
    }

    // Only redirect if we're not loading AND not authenticated
    // This prevents the flash redirect when auth state is still loading
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check if 2FA is enabled but not verified
    // Don't redirect if we're already on the verify-2fa page to prevent loops
    if (isAuthenticated && user?.twoFaStatus === TwofaStatus.ACTIVE && !isTwoFaVerified) {
      // Only redirect if we're not already on the verify-2fa page
      if (!pathname?.includes('verify-2fa')) {
        router.push('/verify-2fa');
      }
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    isRouteLoading,
    isAccessible,
    user,
    isTwoFaVerified,
    router,
    redirectTo,
    pathname,
  ]);

  // Show loading while checking authentication or route access
  if (isLoading || isRouteLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show Access Denied page if route is not accessible
  if (!isAccessible) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
