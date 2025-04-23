'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [joinDate, setJoinDate] = useState<string>('');

  useEffect(() => {
    if (user?.created_at) {
      const date = new Date(user.created_at);
      setJoinDate(date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    }
  }, [user]);

  // 사용자 이메일에서 이니셜 추출
  const getUserInitials = (email: string) => {
    if (!email) return "?";
    const parts = email.split("@");
    if (parts.length > 0) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return "?";
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10">
        <p className="text-center">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-10">
        <p className="text-center">로그인이 필요합니다.</p>
        <div className="flex justify-center mt-4">
          <Button onClick={() => router.push('/login')}>로그인하기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-6">내 프로필</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 프로필 정보 카드 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
            <CardDescription>
              내 계정 정보를 확인하고 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                <AvatarFallback className="text-2xl">{getUserInitials(user.email || '')}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-3 text-center md:text-left">
                <div>
                  <p className="text-sm text-muted-foreground">이메일</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">사용자 ID</p>
                  <p className="font-medium">{user.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">가입일</p>
                  <p className="font-medium">{joinDate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">이메일 인증 상태</p>
                  <p className={`font-medium ${user.email_confirmed_at ? 'text-green-500' : 'text-red-500'}`}>
                    {user.email_confirmed_at ? '인증됨' : '인증 필요'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 계정 관리 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>계정 관리</CardTitle>
            <CardDescription>
              계정 설정 및 보안
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/settings">
                계정 설정
              </a>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/forgot-password">
                비밀번호 변경
              </a>
            </Button>
            
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              로그아웃
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 