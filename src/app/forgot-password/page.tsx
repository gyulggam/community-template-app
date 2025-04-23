import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: '비밀번호 찾기 | 커뮤니티 템플릿 앱',
  description: '비밀번호를 잊어버리셨나요? 이메일 주소를 입력하세요.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <ForgotPasswordForm />
    </div>
  );
} 