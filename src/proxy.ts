import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'gs-sport-super-secret-key-2024'
);

const protectedRoutes = ['/dashboard', '/checkout'];
const adminRoutes = ['/admin'];
const authRoutes = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('gs-sport-token')?.value;

  let user = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload;
    } catch {
      user = null;
    }
  }

  // Redirect authenticated users away from auth routes
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect user routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if ((user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
  ],
};
