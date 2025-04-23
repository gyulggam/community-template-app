import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
// 환경 변수가 설정되어 있지 않으면 빈 문자열로 대체됩니다
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 초기화 - 쿠키 기반 세션 활성화
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') {
          return null;
        }
        return window.localStorage.getItem(key);
      },
      setItem: (key, value) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
      },
      removeItem: (key) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      }
    }
  }
});

// 타입 정의
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          email: string;
          avatar?: string;
          bio?: string;
          role: 'user' | 'admin' | 'moderator';
          is_verified: boolean;
          followers?: number;
          following?: number;
          post_count?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          display_name: string;
          email: string;
          avatar?: string;
          bio?: string;
          role?: 'user' | 'admin' | 'moderator';
          is_verified?: boolean;
          followers?: number;
          following?: number;
          post_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string;
          email?: string;
          avatar?: string;
          bio?: string;
          role?: 'user' | 'admin' | 'moderator';
          is_verified?: boolean;
          followers?: number;
          following?: number;
          post_count?: number;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          parent_id?: string;
          post_count?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          parent_id?: string;
          post_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          parent_id?: string;
          post_count?: number;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title?: string;
          content: string;
          author_id: string;
          category_id?: string;
          type: 'social' | 'forum' | 'blog' | 'ecommerce';
          status: 'published' | 'draft' | 'archived';
          tags?: string[];
          likes_count: number;
          comments_count: number;
          views_count: number;
          images?: string[];
          is_solved?: boolean;
          accepted_answer_id?: string;
          excerpt?: string;
          reading_time?: number;
          price?: number;
          availability?: 'in_stock' | 'out_of_stock' | 'pre_order';
          metadata?: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: string;
          content: string;
          author_id: string;
          category_id?: string;
          type: 'social' | 'forum' | 'blog' | 'ecommerce';
          status?: 'published' | 'draft' | 'archived';
          tags?: string[];
          likes_count?: number;
          comments_count?: number;
          views_count?: number;
          images?: string[];
          is_solved?: boolean;
          accepted_answer_id?: string;
          excerpt?: string;
          reading_time?: number;
          price?: number;
          availability?: 'in_stock' | 'out_of_stock' | 'pre_order';
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          category_id?: string;
          status?: 'published' | 'draft' | 'archived';
          tags?: string[];
          likes_count?: number;
          comments_count?: number;
          views_count?: number;
          images?: string[];
          is_solved?: boolean;
          accepted_answer_id?: string;
          excerpt?: string;
          reading_time?: number;
          price?: number;
          availability?: 'in_stock' | 'out_of_stock' | 'pre_order';
          metadata?: Record<string, any>;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          post_id: string;
          parent_id?: string;
          likes_count: number;
          is_accepted?: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          author_id: string;
          post_id: string;
          parent_id?: string;
          likes_count?: number;
          is_accepted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          likes_count?: number;
          is_accepted?: boolean;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          target_type: 'post' | 'comment';
          target_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: 'post' | 'comment';
          target_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          post_count?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          post_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          post_count?: number;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
          message: string;
          is_read: boolean;
          target_type?: 'post' | 'comment' | 'user';
          target_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
          message: string;
          is_read?: boolean;
          target_type?: 'post' | 'comment' | 'user';
          target_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          is_read?: boolean;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark' | 'system';
          notifications_enabled: boolean;
          email_notifications_enabled: boolean;
          ads_enabled: boolean;
          is_premium: boolean;
          subscription_end_date?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: 'light' | 'dark' | 'system';
          notifications_enabled?: boolean;
          email_notifications_enabled?: boolean;
          ads_enabled?: boolean;
          is_premium?: boolean;
          subscription_end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          theme?: 'light' | 'dark' | 'system';
          notifications_enabled?: boolean;
          email_notifications_enabled?: boolean;
          ads_enabled?: boolean;
          is_premium?: boolean;
          subscription_end_date?: string;
          updated_at?: string;
        };
      };
    };
  };
}; 