'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 비밀번호 재설정 요청 폼 유효성 검사 스키마
const forgotPasswordSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPasswordEmail } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      await resetPasswordEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('비밀번호 재설정 이메일 전송 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일이 제출된 후 표시되는 내용
  if (isSubmitted) {
    return (
      <div className="w-full max-w-md space-y-6 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">이메일 전송 완료</h2>
          <p className="text-sm text-gray-500 mt-4">
            비밀번호 재설정 링크가 포함된 이메일을 발송했습니다.
            이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정하세요.
          </p>
          <p className="mt-4">
            <a 
              href="/login" 
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              로그인 페이지로 돌아가기
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">비밀번호 찾기</h2>
        <p className="text-sm text-gray-500 mt-1">
          계정에 등록된 이메일 주소를 입력하세요
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

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '비밀번호 재설정 이메일 전송'}
        </Button>
      </form>

      <p className="text-center text-sm mt-4">
        <a 
          href="/login" 
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          로그인으로 돌아가기
        </a>
      </p>
    </div>
  );
} 