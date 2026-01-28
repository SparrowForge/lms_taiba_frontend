import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { Status } from '@/enums';

import { useAuth } from '@/hooks/useAuth';
import { useMenus } from '@/hooks/useMenus';
import { isRouteAccessible } from '@/utils/routeAccess';

/**
 * Hook to check if current route is accessible based on myMenus
 * @returns Object with isAccessible flag and loading state
 */
export const useRouteAccess = () => {
  const pathname = usePathname();
  const { myMenus, myMenusStatus, loadMyMenus } = useMenus();
  const { isAuthenticated, user } = useAuth();

  // Ensure menus are loaded when authenticated
  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      myMenusStatus.status !== Status.LOADING &&
      (!myMenus || myMenus.length === 0)
    ) {
      loadMyMenus();
    }
  }, [isAuthenticated, user, myMenus, myMenusStatus.status, loadMyMenus]);

  const isAccessible = useMemo(() => {
    // If not authenticated, allow access (auth check happens in ProtectedRoute)
    if (!isAuthenticated) {
      return true;
    }

    // If menus are still loading, allow access temporarily
    if (myMenusStatus.status === Status.LOADING) {
      return true;
    }

    // If menus failed to load, deny access (except public routes)
    if (myMenusStatus.status === Status.FAILED) {
      return false;
    }

    // Check route access
    return isRouteAccessible(pathname || '', myMenus || []);
  }, [pathname, myMenus, myMenusStatus.status, isAuthenticated]);

  return {
    isAccessible,
    isLoading: myMenusStatus.status === Status.LOADING,
  };
};
