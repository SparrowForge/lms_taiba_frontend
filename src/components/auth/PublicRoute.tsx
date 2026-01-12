'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo = '/' }: PublicRouteProps) => {
  const { isAuthenticated, isLoading, user, isTwoFaVerified } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Allow authenticated users on verify-2fa page (they need to verify 2FA)
    if (pathname?.includes('verify-2fa')) {
      return;
    }

    // Redirect authenticated users away from public pages (except verify-2fa)
    if (isAuthenticated) {
      // If user has 2FA enabled but not verified, they should stay on verify-2fa
      // But if they're on another public page, redirect to verify-2fa or dashboard
      if (user?.twoFaStatus === 'active' && !isTwoFaVerified) {
        router.push('/verify-2fa');
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, user, isTwoFaVerified, router, redirectTo, pathname]);

  // // Show loading while checking authentication
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <Spin size="large" />
  //     </div>
  //   )
  // }

  // Don't render children if already authenticated
  // if (isAuthenticated) {
  //   return null
  // }

  return <>{children}</>;
};
