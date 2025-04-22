// 타임스탬프 필드를 포함하는 기본 인터페이스
export interface BaseEntity {
  id: string | number;
  createdAt: string; // ISO 형식의 날짜 문자열
  updatedAt: string;
}

// 사용자 모델
export interface User extends BaseEntity {
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin' | 'moderator';
  isVerified: boolean;
  followers?: number;
  following?: number;
  postCount?: number;
}

// 카테고리 모델
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | number | null;
  postCount?: number;
}

// 공통 게시글 모델 (소셜, 포럼, 블로그 등 모든 타입에 적용 가능)
export interface Post extends BaseEntity {
  title?: string; // 소셜 타입에서는 필요 없을 수 있음
  content: string; 
  authorId: string | number;
  author?: User;  // 조인 데이터
  categoryId?: string | number | null;
  category?: Category; // 조인 데이터
  type: 'social' | 'forum' | 'blog' | 'ecommerce'; // 게시글 타입
  status: 'published' | 'draft' | 'archived';
  tags?: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  images?: string[]; // 이미지 URL 배열
  
  // 포럼 타입 특화 필드
  isSolved?: boolean;
  acceptedAnswerId?: string | number | null;
  
  // 블로그 타입 특화 필드
  excerpt?: string;
  readingTime?: number;
  
  // 커머스 타입 특화 필드
  price?: number;
  availability?: 'in_stock' | 'out_of_stock' | 'pre_order';
  
  // 메타데이터 (확장 가능)
  metadata?: Record<string, any>;
}

// 댓글 모델
export interface Comment extends BaseEntity {
  content: string;
  authorId: string | number;
  author?: User; // 조인 데이터
  postId: string | number;
  parentId?: string | number | null; // 대댓글을 위한 필드
  likesCount: number;
  isAccepted?: boolean; // 포럼 타입에서 채택된 답변인지 여부
}

// 좋아요 모델
export interface Like extends BaseEntity {
  userId: string | number;
  targetType: 'post' | 'comment';
  targetId: string | number;
}

// 태그 모델
export interface Tag extends BaseEntity {
  name: string;
  slug: string;
  postCount?: number;
}

// 알림 모델
export interface Notification extends BaseEntity {
  userId: string | number;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  message: string;
  isRead: boolean;
  targetType?: 'post' | 'comment' | 'user';
  targetId?: string | number;
}

// 사용자 설정 모델
export interface UserSetting extends BaseEntity {
  userId: string | number;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  adsEnabled: boolean;
  isPremium: boolean;
  subscriptionEndDate?: string;
} 