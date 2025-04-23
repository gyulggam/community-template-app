'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 회원가입 폼 유효성 검사 스키마
const registerSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .regex(/[A-Z]/, '비밀번호에는 최소 하나의 대문자가 포함되어야 합니다.')
    .regex(/[0-9]/, '비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.')
    .regex(/[^A-Za-z0-9]/, '비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, loginWithOAuth } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      await signUp(data.email, data.password);
      reset();
    } catch (error) {
      console.error('회원가입 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      setIsLoading(true);
      await loginWithOAuth(provider);
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">회원가입</h2>
        <p className="text-sm text-gray-500 mt-1">
          새 계정을 만들어 서비스를 이용해보세요
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
          <Label htmlFor="password">비밀번호</Label>
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '회원가입'}
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
        이미 계정이 있으신가요?{' '}
        <a 
          href="/login" 
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          로그인
        </a>
      </p>
    </div>
  );
} 