import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

// Protected routes that require authentication
const protectedRoutes = [
  '/', // Dashboard
  '/users',
  '/panels',
  '/branches',
  '/departments',
  '/roles',
  '/menus',
  '/role-menu-permissions',
  '/courses',
  '/batches',
  '/semesters',
  '/semester-subjects',
  '/subjects',
  '/faculties',
  '/faculty-subjects',
  '/audit',
  '/settings',
  '/addresses',
  '/course-types',
  '/schedule-types',
  '/employment-types',
  '/institutes',
  '/grade-rules',
  '/mark-distributions',
  '/exams',
  '/exam-candidates',
  '/exam-mcq-questions',
  '/exam-results',
  '/exam-schedules',
  '/exam-types',
  '/rooms',
  '/room-types',
  '/class-schedules',
  '/week-days',
];

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password'];

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale and path without locale
  const pathSegments = pathname.split('/');
  const locale = pathSegments[1];
  const supportedLocales = (routing as unknown as { locales: string[] }).locales ?? [];
  const defaultLocale = (routing as unknown as { defaultLocale: string }).defaultLocale ?? 'en';
  const isValidLocale = !!locale && supportedLocales.includes(locale);
  const resolvedLocale = isValidLocale ? locale : defaultLocale;
  const pathWithoutLocale = (isValidLocale ? pathSegments.slice(2) : pathSegments.slice(1)).join(
    '/',
  );

  // Check if the route is protected (exact match or starts with protected route)
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route === '/') {
      return pathWithoutLocale === '' || pathWithoutLocale === undefined;
    }
    return pathWithoutLocale.startsWith(route.replace('/', ''));
  });

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathWithoutLocale.startsWith(route.replace('/', '')),
  );

  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Middleware Debug:', {
      pathname,
      locale,
      pathWithoutLocale,
      isProtectedRoute,
      isPublicRoute,
      isAuthenticated,
      hasToken: !!token,
    });
  }

  // If accessing protected route without authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(`/${resolvedLocale}/login`, request.url);
    console.log('🚫 Redirecting to login:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login page while authenticated, redirect to dashboard
  if (isPublicRoute && isAuthenticated) {
    const dashboardUrl = new URL(`/${resolvedLocale}`, request.url);
    console.log('✅ Redirecting to dashboard:', dashboardUrl.toString());
    return NextResponse.redirect(dashboardUrl);
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
