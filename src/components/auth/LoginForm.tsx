'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 로그인 폼 유효성 검사 스키마
const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, loginWithOAuth } = useAuth();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);
      reset();
      
      // 세션이 설정되었는지 확인
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('로그인 후 세션 확인:', {
        hasSession: !!sessionData.session,
        user: sessionData.session?.user?.email
      });
      
      // 로그인 성공 시 페이지 새로고침 후 홈으로 이동
      // 이렇게 하면 세션이 제대로 적용됩니다
      toast.success('로그인 성공! 메인 페이지로 이동합니다.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('로그인 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      setIsLoading(true);
      await loginWithOAuth(provider);
      
      // 세션이 설정되었는지 확인
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('OAuth 로그인 후 세션 확인:', {
        hasSession: !!sessionData.session,
        user: sessionData.session?.user?.email
      });
      
      // OAuth 로그인 성공 시에도 페이지 새로고침 후 홈으로 이동
      toast.success('로그인 성공! 메인 페이지로 이동합니다.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
      toast.error(`${provider} 로그인에 실패했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">로그인</h2>
        <p className="text-sm text-gray-500 mt-1">
          계정에 로그인하여 서비스를 이용해보세요
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="이메일 주소를 입력하세요"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">비밀번호</Label>
            <a 
              href="/forgot-password"
              className="text-xs text-blue-600 hover:text-blue-500"
            >
              비밀번호를 잊으셨나요?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button" 
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin('google')}
          disabled={isLoading}
        >
          Google로 계속하기
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin('github')}
          disabled={isLoading}
        >
          GitHub로 계속하기
        </Button>
      </div>

      <p className="text-center text-sm mt-4">
        계정이 없으신가요?{' '}
        <a 
          href="/register" 
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          회원가입
        </a>
      </p>
    </div>
  );
} 