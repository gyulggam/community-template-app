-- Supabase SQL 스키마 정의
-- 이 스크립트를 Supabase 대시보드의 SQL 에디터에서 실행하세요

-- 사용자 테이블 생성 (auth.users와 별개로 추가 정보 저장)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  post_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 사용자 정책: 관리자는 모든 작업 가능, 사용자는 자신의 정보만 수정 가능, 모두 조회 가능
CREATE POLICY "사용자 조회는 모두에게 허용" ON users FOR SELECT USING (true);
CREATE POLICY "사용자는 자신의 정보만 수정 가능" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "관리자만 사용자 삭제 가능" ON users FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 카테고리 테이블 생성
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  post_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 카테고리 RLS 설정
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "카테고리 조회는 모두에게 허용" ON categories FOR SELECT USING (true);
CREATE POLICY "관리자와 운영자만 카테고리 생성 가능" ON categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "관리자와 운영자만 카테고리 수정 가능" ON categories FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- 댓글 테이블 생성 (먼저 생성)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  post_id UUID NOT NULL, -- 여기서는 참조 제약 조건을 나중에 추가
  parent_id UUID, -- 여기서는 자체 참조 제약 조건을 나중에 추가
  likes_count INT DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 게시글 테이블 생성
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  type TEXT NOT NULL CHECK (type IN ('social', 'forum', 'blog', 'ecommerce')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  tags TEXT[] DEFAULT '{}'::TEXT[],
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  images TEXT[] DEFAULT '{}'::TEXT[],
  is_solved BOOLEAN DEFAULT FALSE,
  accepted_answer_id UUID,
  excerpt TEXT,
  reading_time INT,
  price DECIMAL(10, 2),
  availability TEXT CHECK (availability IN ('in_stock', 'out_of_stock', 'pre_order')),
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 테이블 생성 후 외래 키 제약 조건 추가
ALTER TABLE comments ADD CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES posts(id);
ALTER TABLE comments ADD CONSTRAINT fk_parent_id FOREIGN KEY (parent_id) REFERENCES comments(id);
ALTER TABLE posts ADD CONSTRAINT fk_accepted_answer FOREIGN KEY (accepted_answer_id) REFERENCES comments(id) DEFERRABLE INITIALLY DEFERRED;

-- 게시글 RLS 설정
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "게시글 조회는 모두에게 허용" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "사용자는 자신의 게시글만 수정 가능" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "사용자는 자신의 게시글 생성 가능" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "사용자는 자신의 게시글만 삭제 가능" ON posts FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "관리자와 운영자는 모든 게시글 수정 및 삭제 가능" ON posts FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- 댓글 RLS 설정
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "댓글 조회는 모두에게 허용" ON comments FOR SELECT USING (true);
CREATE POLICY "사용자는 자신의 댓글 생성 가능" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "사용자는 자신의 댓글만 수정 가능" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "사용자는 자신의 댓글만 삭제 가능" ON comments FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "관리자와 운영자는 모든 댓글 수정 및 삭제 가능" ON comments FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- 좋아요 테이블 생성
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- 좋아요 대상 유효성 검사 트리거
CREATE OR REPLACE FUNCTION validate_like_target()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.target_type = 'post' THEN
    IF NOT EXISTS (SELECT 1 FROM posts WHERE id = NEW.target_id) THEN
      RAISE EXCEPTION 'Invalid post ID';
    END IF;
  ELSIF NEW.target_type = 'comment' THEN
    IF NOT EXISTS (SELECT 1 FROM comments WHERE id = NEW.target_id) THEN
      RAISE EXCEPTION 'Invalid comment ID';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_like_target_trigger
BEFORE INSERT OR UPDATE ON likes
FOR EACH ROW EXECUTE FUNCTION validate_like_target();

-- 좋아요 RLS 설정
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "좋아요 조회는 모두에게 허용" ON likes FOR SELECT USING (true);
CREATE POLICY "사용자는 좋아요 생성 가능" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 좋아요만 삭제 가능" ON likes FOR DELETE USING (auth.uid() = user_id);

-- 태그 테이블 생성
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  post_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 태그 RLS 설정
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "태그 조회는 모두에게 허용" ON tags FOR SELECT USING (true);
CREATE POLICY "관리자와 운영자만 태그 생성 및 수정 가능" ON tags FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- 알림 테이블 생성
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'mention', 'system')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  target_type TEXT CHECK (target_type IN ('post', 'comment', 'user')),
  target_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 알림 RLS 설정
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "사용자는 자신의 알림만 조회 가능" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "시스템은 모든 알림 생성 가능" ON notifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "사용자는 자신의 알림만 수정 가능" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- 사용자 설정 테이블 생성
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications_enabled BOOLEAN DEFAULT TRUE,
  ads_enabled BOOLEAN DEFAULT TRUE,
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 사용자 설정 RLS 설정
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "사용자는 자신의 설정만 조회 및 수정 가능" ON user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "관리자는 모든 사용자 설정 조회 및 수정 가능" ON user_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 게시글 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET views_count = views_count + 1, updated_at = NOW() WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 댓글 생성 시 게시글 댓글 수 증가 트리거
CREATE OR REPLACE FUNCTION increment_post_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count + 1, updated_at = NOW() WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_post_comments_trigger
AFTER INSERT ON comments
FOR EACH ROW EXECUTE FUNCTION increment_post_comments();

-- 댓글 삭제 시 게시글 댓글 수 감소 트리거
CREATE OR REPLACE FUNCTION decrement_post_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count - 1, updated_at = NOW() WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_post_comments_trigger
AFTER DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION decrement_post_comments();

-- 좋아요 생성 시 대상 좋아요 수 증가 트리거
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.target_type = 'post' THEN
    UPDATE posts SET likes_count = likes_count + 1, updated_at = NOW() WHERE id = NEW.target_id;
  ELSIF NEW.target_type = 'comment' THEN
    UPDATE comments SET likes_count = likes_count + 1, updated_at = NOW() WHERE id = NEW.target_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_likes_count_trigger
AFTER INSERT ON likes
FOR EACH ROW EXECUTE FUNCTION increment_likes_count();

-- 좋아요 삭제 시 대상 좋아요 수 감소 트리거
CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.target_type = 'post' THEN
    UPDATE posts SET likes_count = likes_count - 1, updated_at = NOW() WHERE id = OLD.target_id;
  ELSIF OLD.target_type = 'comment' THEN
    UPDATE comments SET likes_count = likes_count - 1, updated_at = NOW() WHERE id = OLD.target_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_likes_count_trigger
AFTER DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION decrement_likes_count();

-- 사용자 생성 시 사용자 설정도 자동 생성
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_settings_trigger
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION create_user_settings();

-- 기본 카테고리 추가
INSERT INTO categories (name, slug, description) VALUES
('개발/프로그래밍', 'programming', '개발 및 프로그래밍 관련 토론'),
('디자인', 'design', '디자인 관련 토론'),
('마케팅', 'marketing', '마케팅 관련 토론'),
('비즈니스', 'business', '비즈니스 및 창업 관련 토론');