import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// 보호된 라우트 목록 (로그인한 사용자만 접근 가능)
const protectedRoutes = [
  '/profile',
  '/settings',
  '/board',
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
    // 현재 URL 확인
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 리다이렉트 루프 방지를 위한 확인
    const fromRedirect = request.headers.get('x-middleware-redirect');
    
    // 이미 리다이렉트된 요청은 처리하지 않음
    if (fromRedirect === 'true') {
      console.log('리다이렉트된 요청, 미들웨어 건너뜀');
      return NextResponse.next();
    }
    
    // response 객체 생성
    const response = NextResponse.next();
    
    // supabase 클라이언트 생성 - 쿠키 세션 관리 사용
    const supabase = createMiddlewareClient({ 
      req: request, 
      res: response,
    });
    
    // 현재 세션을 가져옴
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();
    
    // 세션 에러가 있는 경우
    if (sessionError) {
      console.error('세션 에러:', sessionError);
    }
    
    // 인증된 사용자가 인증 페이지에 접근하려는 경우 홈으로 리다이렉트
    if (session && authRoutes.some(route => path.startsWith(route))) {
      console.log('인증된 사용자가 인증 페이지 접근, 홈으로 리다이렉트');
      const redirectUrl = new URL('/', request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      redirectResponse.headers.set('x-middleware-redirect', 'true');
      
      // 세션 쿠키 복사
      request.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      
      return redirectResponse;
    }
    
    // 인증되지 않은 사용자가 보호된 라우트에 접근하려는 경우 로그인 페이지로 리다이렉트
    if (!session && protectedRoutes.some(route => path.startsWith(route))) {
      console.log('인증되지 않은 사용자가 보호된 페이지 접근, 로그인으로 리다이렉트');
      const redirectUrl = new URL('/login', request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      redirectResponse.headers.set('x-middleware-redirect', 'true');
      return redirectResponse;
    }
    
    return response;
  } catch (e) {
    // 오류 발생 시 로그인 페이지로 리다이렉트
    console.error('Auth middleware error:', e);
    const redirectUrl = new URL('/login', request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    redirectResponse.headers.set('x-middleware-redirect', 'true');
    return redirectResponse;
  }
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: [
    '/profile/:path*',
    '/settings/:path*',
    '/board/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/template',
    '/template/:path*',
  ],
}; 