/**
 * proxy.ts — Next.js 16 Proxy (formerly middleware.ts)
 *
 * Provides an EARLY REDIRECT for unauthenticated access to /admin routes.
 * This is a first layer of protection only — every server page/action
 * must ALSO call requireAdmin() or requireSuperAdmin() server-side.
 *
 * The proxy cannot check the Supabase role column because it runs at
 * the edge without access to the DB. It only verifies the presence of
 * a valid Supabase auth session cookie.
 */

import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check for any Supabase auth token cookie presence
  // Supabase SSR stores session in cookies prefixed with sb-
  const hasSomeAuthCookie = Array.from(request.cookies.getAll()).some(
    (cookie) =>
      cookie.name.startsWith('sb-') ||
      cookie.name.includes('auth-token') ||
      cookie.name.includes('access-token')
  );

  const isDev = process.env.NODE_ENV === 'development';

  if (!hasSomeAuthCookie && !isDev) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('reason', 'unauthenticated');
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth cookie exists — let the server component verify the role
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
