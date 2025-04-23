import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';

// 로그인 함수 (이메일/비밀번호)
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// 회원가입 함수
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

// 로그아웃 함수
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// 현재 세션 가져오기
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

// 현재 사용자 가져오기
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// 비밀번호 재설정 이메일 전송
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};

// 비밀번호 업데이트
export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  return { data, error };
};

// OAuth 로그인 (구글, 깃허브 등)
export const signInWithOAuth = async (provider: 'google' | 'github' | 'facebook') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });
  return { data, error };
};

// 세션 변경 리스너 설정
export const onAuthStateChange = (callback: (session: Session | null, user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session, session?.user || null);
  });
}; 