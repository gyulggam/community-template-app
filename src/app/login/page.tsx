import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: '로그인 | 커뮤니티 템플릿 앱',
  description: '로그인하여 서비스를 이용해보세요',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
} 