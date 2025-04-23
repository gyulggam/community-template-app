import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: '회원가입 | 커뮤니티 템플릿 앱',
  description: '새 계정을 만들어 서비스를 이용해보세요',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
} 