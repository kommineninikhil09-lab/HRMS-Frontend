import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // The refresh token (7d) is the durable session marker; the access token
  // cookie (15m) comes and goes and is refreshed by the API route handlers.
  const hasSession = Boolean(request.cookies.get('refreshToken')?.value);
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ['/login'];

  if (publicRoutes.includes(pathname)) {
    if (hasSession && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // API routes handle auth (and token refresh) themselves.
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Root is reachable signed-in or not.
  if (pathname === '/') {
    return NextResponse.next();
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|_next/data).*)'],
};
