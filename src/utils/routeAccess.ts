import { IMenu } from '@/types/menu';

/**
 * Public routes that don't require menu permission check
 */
export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/register-student',
  '/verify-2fa',
  '/reset-password',
];

/**
 * Routes that are accessible to all authenticated users (bypass menu check)
 * Supports wildcard patterns: use * for dynamic segments (e.g., /users/:id/edit)
 */
export const ALLOWED_ROUTES = [
  '/settings',
  '/settings/profile',
  '/notifications',
];

/**
 * Removes locale prefix from pathname
 * @param pathname - Full pathname (e.g., '/en/users' or '/users')
 * @param locales - Array of supported locales
 * @returns Path without locale prefix
 */
export const removeLocalePrefix = (pathname: string, locales: string[] = ['en', 'ar']): string => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    return '/' + segments.slice(1).join('/');
  }
  return pathname.startsWith('/') ? pathname : '/' + pathname;
};

/**
 * Normalizes a route for comparison (removes trailing slashes, handles root)
 * @param route - Route path
 * @returns Normalized route
 */
export const normalizeRoute = (route: string): string => {
  if (!route || route === '/') return '/';
  return route.startsWith('/') ? route : '/' + route;
};

/**
 * Checks if a route matches a pattern (supports wildcards)
 * @param route - Route to check
 * @param pattern - Pattern to match against (supports * wildcard)
 * @returns True if route matches pattern
 */
export const matchesPattern = (route: string, pattern: string): boolean => {
  const normalizedRoute = normalizeRoute(route);
  const normalizedPattern = normalizeRoute(pattern);

  // Convert pattern to regex (replace * with [^/]+)
  const regexPattern = normalizedPattern
    .replace(/\*/g, '[^/]+')
    .replace(/\//g, '\\/');
  const regex = new RegExp(`^${regexPattern}$`);

  return regex.test(normalizedRoute);
};

/**
 * Checks if a route matches a menu route (exact or prefix match)
 * @param route - Route to check
 * @param menuRoute - Menu route to match against
 * @returns True if route matches
 */
export const isRouteMatch = (route: string, menuRoute: string): boolean => {
  const normalizedRoute = normalizeRoute(route);
  const normalizedMenuRoute = normalizeRoute(menuRoute);

  // Exact match
  if (normalizedRoute === normalizedMenuRoute) {
    return true;
  }

  // Prefix match (e.g., /users/123 matches /users)
  if (normalizedRoute.startsWith(normalizedMenuRoute + '/')) {
    return true;
  }

  return false;
};

/**
 * Recursively collects all routes from menu tree (including nested children)
 * @param menus - Array of menus
 * @returns Array of all route strings
 */
export const getAllMenuRoutes = (menus: IMenu[]): string[] => {
  const routes: string[] = [];

  const collectRoutes = (menuList: IMenu[]) => {
    for (const menu of menuList) {
      if (menu.route) {
        routes.push(menu.route);
      }
      if (menu.children && menu.children.length > 0) {
        collectRoutes(menu.children);
      }
    }
  };

  collectRoutes(menus);
  return routes;
};

/**
 * Checks if a route is accessible based on myMenus
 * @param pathname - Current pathname
 * @param myMenus - Array of user's menus
 * @param locales - Supported locales
 * @returns True if route is accessible
 */
export const isRouteAccessible = (
  pathname: string,
  myMenus: IMenu[],
  locales: string[] = ['en', 'ar'],
): boolean => {
  // Remove locale prefix
  const routeWithoutLocale = removeLocalePrefix(pathname, locales);

  // Check if it's a public route
  const isPublic = PUBLIC_ROUTES.some((publicRoute) => {
    return routeWithoutLocale === publicRoute || routeWithoutLocale.startsWith(publicRoute + '/');
  });

  if (isPublic) {
    return true;
  }

  // Check if it's an allowed route (accessible to all authenticated users)
  // Supports both exact matches and wildcard patterns
  const isAllowed = ALLOWED_ROUTES.some((allowedRoute) => {
    // Check for wildcard pattern
    if (allowedRoute.includes('*')) {
      return matchesPattern(routeWithoutLocale, allowedRoute);
    }
    // Exact match or prefix match
    return (
      routeWithoutLocale === allowedRoute || routeWithoutLocale.startsWith(allowedRoute + '/')
    );
  });

  if (isAllowed) {
    return true;
  }

  // If no menus, deny access (except public and allowed routes)
  if (!myMenus || myMenus.length === 0) {
    return false;
  }

  // Get all routes from menu tree
  const menuRoutes = getAllMenuRoutes(myMenus);

  // Check if route matches any menu route
  return menuRoutes.some((menuRoute) => isRouteMatch(routeWithoutLocale, menuRoute));
};
