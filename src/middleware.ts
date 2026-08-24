import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];

  // Allow access to public routes without token
  if (publicRoutes.includes(pathname)) {
    // If already authenticated and on login page, redirect to home
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Allow access to API routes (they handle auth themselves)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow root path for both authenticated and unauthenticated
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected routes without token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|_next/data).*)'],
};
