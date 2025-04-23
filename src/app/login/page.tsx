import { Metadata } from 'next';
import LoginClient from './login-client';

export const metadata: Metadata = {
  title: '로그인 | 커뮤니티 템플릿 앱',
  description: '로그인하여 서비스를 이용해보세요',
};

export default function LoginPage() {
  return <LoginClient />;
} 