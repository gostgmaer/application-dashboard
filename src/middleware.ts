import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { secret } from './config/setting';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }
 const t = await getToken({ req, secret });
  // console.log("t",t);
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/auth') || pathname === '/';

  if (isProtectedRoute || isAuthRoute) {
    const token = await getToken({ req, secret });

    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (isAuthRoute && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/', // homepage
  ],
};
