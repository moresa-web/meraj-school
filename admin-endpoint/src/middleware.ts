import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const isAuthPage = request.nextUrl.pathname === '/login';

  // اگر کاربر به صفحه login می‌رود و توکن دارد، به صفحه اصلی هدایت شود
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // اگر کاربر به صفحات محافظت شده می‌رود و توکن ندارد، به صفحه login هدایت شود
  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 