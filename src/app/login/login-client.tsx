'use client';

import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginClient() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 이미 로그인된 사용자라면 홈페이지로 리다이렉트
    if (user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoginForm />
    </div>
  );
} 