import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// 보호된 라우트 목록 (로그인한 사용자만 접근 가능)
const protectedRoutes = [
  '/profile',
  '/settings',
];

// 인증이 필요하지 않은 라우트 목록 (로그인하지 않은 사용자만 접근 가능)
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export async function middleware(request: NextRequest) {
  try {
    // supabase 클라이언트 생성
    const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
    
    // 현재 세션을 가져옴
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    const path = request.nextUrl.pathname;
    
    // 인증된 사용자가 인증 페이지에 접근하려는 경우 홈으로 리다이렉트
    if (session && authRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // 인증되지 않은 사용자가 보호된 라우트에 접근하려는 경우 로그인 페이지로 리다이렉트
    if (!session && protectedRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
  } catch (e) {
    // 오류 발생 시 로그인 페이지로 리다이렉트
    console.error('Auth middleware error:', e);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: [
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
}; 