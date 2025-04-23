'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import {
  getCurrentSession,
  getCurrentUser,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  resetPassword,
  signInWithOAuth,
  onAuthStateChange,
} from '@/lib/supabase-auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPasswordEmail: (email: string) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'github' | 'facebook') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 세션 및 사용자 정보 로드
    const loadUserSession = async () => {
      try {
        const { data, error } = await getCurrentSession();
        if (error) {
          console.error('세션 로드 오류:', error);
          return;
        }

        setSession(data.session);
        
        if (data.session) {
          const { user, error: userError } = await getCurrentUser();
          if (userError) {
            console.error('사용자 로드 오류:', userError);
            return;
          }
          setUser(user);
        }
      } catch (error) {
        console.error('인증 데이터 로드 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSession();

    // 인증 상태 변경 감지
    const { data: authListener } = onAuthStateChange((session, user) => {
      setSession(session);
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      // 클린업 함수
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 로그인 함수
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        toast.error('로그인 실패: ' + error.message);
        throw error;
      }
      
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        toast.success('로그인 성공!');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 함수
  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await signUpWithEmail(email, password);
      
      if (error) {
        toast.error('회원가입 실패: ' + error.message);
        throw error;
      }
      
      toast.success('회원가입 성공! 이메일을 확인하세요.');
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await signOut();
      
      if (error) {
        toast.error('로그아웃 실패: ' + error.message);
        throw error;
      }
      
      setUser(null);
      setSession(null);
      toast.success('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 재설정 이메일 전송
  const resetPasswordEmail = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error('비밀번호 재설정 이메일 전송 실패: ' + error.message);
        throw error;
      }
      
      toast.success('비밀번호 재설정 이메일이 전송되었습니다.');
    } catch (error) {
      console.error('비밀번호 재설정 이메일 전송 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth 로그인
  const loginWithOAuth = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      setIsLoading(true);
      const { error } = await signInWithOAuth(provider);
      
      if (error) {
        toast.error(`${provider} 로그인 실패: ` + error.message);
        throw error;
      }
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    logout,
    resetPasswordEmail,
    loginWithOAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다');
  }
  return context;
}; 