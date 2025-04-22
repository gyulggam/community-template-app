import { supabase } from '@/lib/supabase';
import { Post, Comment, User, Category, Tag } from './models';

/**
 * 게시글 ID로 게시글 조회
 */
export async function getPostById(id: number | string): Promise<Post | null> {
  console.log('Fetching post with id:', id);
  
  // UUID 형식 검증 (정규식 패턴)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // 테스트 목적의 데모 데이터 처리 (1, 2, 3과 같은 간단한 ID에 대응)
  if (typeof id === 'number' || !uuidPattern.test(id as string)) {
    console.log('Non-UUID ID detected, using demo data mode');
    
    // 데모 데이터 ID 매핑 (실제 애플리케이션에서는 필요에 따라 구현)
    const demoPostId = typeof id === 'number' ? id.toString() : id;
    
    // 테스트/데모용 포스트 데이터 반환
    if (demoPostId === '1' || demoPostId === '2' || demoPostId === '3') {
      // FORUM_POSTS 배열에서 해당 ID의 게시글 찾기
      const demoPost = FORUM_POSTS.find(post => post.id.toString() === demoPostId);
      
      if (demoPost) {
        return {
          id: demoPost.id.toString(),
          title: demoPost.title,
          content: demoPost.content,
          authorId: 'demo-user-id',
          author: {
            id: 'demo-user-id',
            username: demoPost.author,
            displayName: demoPost.author,
            email: 'demo@example.com',
            role: 'user',
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          categoryId: 'demo-category-id',
          category: {
            id: 'demo-category-id',
            name: demoPost.category,
            slug: demoPost.category.toLowerCase().replace(/\s+/g, '-'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          type: 'forum',
          status: 'published',
          tags: ['demo', 'test'],
          likesCount: demoPost.votes,
          commentsCount: demoPost.answers,
          viewsCount: demoPost.views,
          isSolved: demoPost.isSolved,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    }
    
    console.log('Demo post not found for ID:', id);
    return null;
  }
  
  // UUID 형식이면 정상적으로 Supabase 쿼리 실행
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:author_id(*),
      category:category_id(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post:', error, 'Error details:', JSON.stringify(error));
    return null;
  }

  // 데이터 확인
  console.log('Post data received:', data ? 'Success' : 'Not found');
  
  // 데이터 변환: Supabase 테이블 컬럼명 -> 모델 속성명
  if (data) {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      authorId: data.author_id,
      author: data.author ? transformUserData(data.author) : undefined,
      categoryId: data.category_id,
      category: data.category ? transformCategoryData(data.category) : undefined,
      type: data.type,
      status: data.status,
      tags: data.tags,
      likesCount: data.likes_count,
      commentsCount: data.comments_count,
      viewsCount: data.views_count,
      images: data.images,
      isSolved: data.is_solved,
      acceptedAnswerId: data.accepted_answer_id,
      excerpt: data.excerpt,
      readingTime: data.reading_time,
      price: data.price,
      availability: data.availability,
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  return null;
}

/**
 * 게시글 ID로 댓글 조회
 */
export async function getCommentsByPostId(postId: number | string): Promise<Comment[]> {
  console.log('Fetching comments for post id:', postId);
  
  // UUID 형식 검증 (정규식 패턴)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // 테스트 목적의 데모 데이터 처리 (1, 2, 3과 같은 간단한 ID에 대응)
  if (typeof postId === 'number' || !uuidPattern.test(postId as string)) {
    console.log('Non-UUID post ID detected for comments, using demo data mode');
    
    // 데모 데이터 ID 매핑
    const demoPostId = typeof postId === 'number' ? postId.toString() : postId;
    
    // 테스트/데모용 댓글 데이터 반환
    return DEMO_COMMENTS.filter(comment => comment.postId.toString() === demoPostId).map(demoComment => ({
      id: demoComment.id.toString(),
      content: demoComment.content,
      authorId: demoComment.authorId,
      author: {
        id: demoComment.authorId,
        username: demoComment.authorName,
        displayName: demoComment.authorName,
        email: `${demoComment.authorName.toLowerCase()}@example.com`,
        role: 'user',
        isVerified: true,
        createdAt: demoComment.createdAt,
        updatedAt: demoComment.createdAt
      },
      postId: demoPostId,
      parentId: demoComment.parentId,
      likesCount: demoComment.likesCount,
      isAccepted: demoComment.isAccepted,
      createdAt: demoComment.createdAt,
      updatedAt: demoComment.createdAt
    }));
  }
  
  // UUID 형식이면 정상적으로 Supabase 쿼리 실행
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:author_id(*)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  // 데이터 변환: Supabase 테이블 컬럼명 -> 모델 속성명
  return data.map(comment => ({
    id: comment.id,
    content: comment.content,
    authorId: comment.author_id,
    author: comment.author ? transformUserData(comment.author) : undefined,
    postId: comment.post_id,
    parentId: comment.parent_id,
    likesCount: comment.likes_count,
    isAccepted: comment.is_accepted,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at
  }));
}

/**
 * 사용자 ID로 사용자 조회
 */
export async function getUserById(id: number | string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data ? transformUserData(data) : null;
}

/**
 * 카테고리 ID로 게시글 조회
 */
export async function getPostsByCategory(categoryId: number | string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:author_id(*),
      category:category_id(*)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }

  return data.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.author_id,
    author: post.author ? transformUserData(post.author) : undefined,
    categoryId: post.category_id,
    category: post.category ? transformCategoryData(post.category) : undefined,
    type: post.type,
    status: post.status,
    tags: post.tags,
    likesCount: post.likes_count,
    commentsCount: post.comments_count,
    viewsCount: post.views_count,
    images: post.images,
    isSolved: post.is_solved,
    acceptedAnswerId: post.accepted_answer_id,
    createdAt: post.created_at,
    updatedAt: post.updated_at
  }));
}

/**
 * 게시글 타입으로 게시글 조회
 */
export async function getPostsByType(type: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:author_id(*),
      category:category_id(*)
    `)
    .eq('type', type)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by type:', error);
    return [];
  }

  return data.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.author_id,
    author: post.author ? transformUserData(post.author) : undefined,
    categoryId: post.category_id,
    category: post.category ? transformCategoryData(post.category) : undefined,
    type: post.type,
    status: post.status,
    tags: post.tags,
    likesCount: post.likes_count,
    commentsCount: post.comments_count,
    viewsCount: post.views_count,
    images: post.images,
    isSolved: post.is_solved,
    acceptedAnswerId: post.accepted_answer_id,
    createdAt: post.created_at,
    updatedAt: post.updated_at
  }));
}

/**
 * 태그로 게시글 조회
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:author_id(*),
      category:category_id(*)
    `)
    .contains('tags', [tag])
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }

  return data.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.author_id,
    author: post.author ? transformUserData(post.author) : undefined,
    categoryId: post.category_id,
    category: post.category ? transformCategoryData(post.category) : undefined,
    type: post.type,
    status: post.status,
    tags: post.tags,
    likesCount: post.likes_count,
    commentsCount: post.comments_count,
    viewsCount: post.views_count,
    images: post.images,
    isSolved: post.is_solved,
    acceptedAnswerId: post.accepted_answer_id,
    createdAt: post.created_at,
    updatedAt: post.updated_at
  }));
}

/**
 * 작성자로 게시글 조회
 */
export async function getPostsByAuthor(authorId: number | string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:author_id(*),
      category:category_id(*)
    `)
    .eq('author_id', authorId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by author:', error);
    return [];
  }

  return data.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.author_id,
    author: post.author ? transformUserData(post.author) : undefined,
    categoryId: post.category_id,
    category: post.category ? transformCategoryData(post.category) : undefined,
    type: post.type,
    status: post.status,
    tags: post.tags,
    likesCount: post.likes_count,
    commentsCount: post.comments_count,
    viewsCount: post.views_count,
    images: post.images,
    isSolved: post.is_solved,
    acceptedAnswerId: post.accepted_answer_id,
    createdAt: post.created_at,
    updatedAt: post.updated_at
  }));
}

/**
 * 게시글 조회수 증가
 */
export async function incrementPostViews(postId: number | string): Promise<void> {
  // UUID 형식 검증 (정규식 패턴)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // 테스트 목적의 데모 데이터 처리 (1, 2, 3과 같은 간단한 ID에 대응)
  if (typeof postId === 'number' || !uuidPattern.test(postId as string)) {
    console.log('Non-UUID post ID detected for view increment, using demo mode');
    
    // 데모 모드에서는 로컬 데이터 조작만 하고 실제 DB 업데이트는 하지 않음
    const demoPostId = typeof postId === 'number' ? postId.toString() : postId;
    const demoPost = FORUM_POSTS.find(post => post.id.toString() === demoPostId);
    
    if (demoPost) {
      demoPost.views += 1;
      console.log(`Demo post views incremented: ${demoPost.views}`);
    }
    
    return;
  }
  
  // UUID 형식이면 정상적으로 Supabase 함수 호출
  const { error } = await supabase
    .rpc('increment_post_views', { post_id: postId });

  if (error) {
    console.error('Error incrementing post views:', error);
  }
}

/**
 * 새 게시글 생성
 */
export async function createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post | null> {
  // snake_case로 변환
  const postData = {
    title: post.title,
    content: post.content,
    author_id: post.authorId,
    category_id: post.categoryId,
    type: post.type,
    status: post.status || 'published',
    tags: post.tags || [],
    likes_count: post.likesCount || 0,
    comments_count: post.commentsCount || 0,
    views_count: post.viewsCount || 0,
    images: post.images || [],
    is_solved: post.isSolved || false,
    accepted_answer_id: post.acceptedAnswerId,
    excerpt: post.excerpt,
    reading_time: post.readingTime,
    price: post.price,
    availability: post.availability,
    metadata: post.metadata
  };

  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }

  // 생성된 데이터 반환
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    authorId: data.author_id,
    categoryId: data.category_id,
    type: data.type,
    status: data.status,
    tags: data.tags,
    likesCount: data.likes_count,
    commentsCount: data.comments_count,
    viewsCount: data.views_count,
    images: data.images,
    isSolved: data.is_solved,
    acceptedAnswerId: data.accepted_answer_id,
    excerpt: data.excerpt,
    readingTime: data.reading_time,
    price: data.price,
    availability: data.availability,
    metadata: data.metadata,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * 새 댓글 생성
 */
export async function createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment | null> {
  // UUID 형식 검증 (정규식 패턴)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // 테스트 목적의 데모 데이터 처리
  const postIdStr = String(comment.postId);
  if (typeof comment.postId === 'number' || (typeof comment.postId === 'string' && !uuidPattern.test(comment.postId))) {
    console.log('Non-UUID post ID detected for comment creation, using demo mode');
    
    // 데모 댓글 ID 생성 (간단히 현재 타임스탬프 사용)
    const demoCommentId = Date.now().toString();
    const now = new Date().toISOString();
    
    // 새 데모 댓글 객체 생성
    const newDemoComment = {
      id: demoCommentId,
      content: comment.content,
      authorId: String(comment.authorId || 'guest-user-id'),
      author: {
        id: String(comment.authorId || 'guest-user-id'),
        username: '게스트',
        displayName: '게스트',
        email: 'guest@example.com',
        role: 'user' as const,
        isVerified: false,
        createdAt: now,
        updatedAt: now
      },
      postId: postIdStr,
      parentId: comment.parentId, // TypeScript가 이 필드에 null을 명시적으로 할당하는 것을 허용하지 않음
      likesCount: comment.likesCount || 0,
      isAccepted: comment.isAccepted || false,
      createdAt: now,
      updatedAt: now
    } as Comment; // 타입 단언 사용
    
    // 게시글 댓글 수 증가
    const demoPost = FORUM_POSTS.find(post => post.id.toString() === postIdStr);
    if (demoPost) {
      demoPost.answers += 1;
      console.log(`Demo post comments incremented: ${demoPost.answers}`);
    }
    
    // 간소화: 실제 DEMO_COMMENTS 배열에 직접 추가하지 않고 메모리에 임시 객체만 생성
    console.log('Created demo comment:', demoCommentId);
    
    return newDemoComment;
  }
  
  // snake_case로 변환
  const commentData = {
    content: comment.content,
    author_id: comment.authorId,
    post_id: comment.postId,
    parent_id: comment.parentId,
    likes_count: comment.likesCount || 0,
    is_accepted: comment.isAccepted || false
  };

  const { data, error } = await supabase
    .from('comments')
    .insert(commentData)
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }

  // 생성된 데이터 반환
  return {
    id: data.id,
    content: data.content,
    authorId: data.author_id,
    postId: data.post_id,
    parentId: data.parent_id,
    likesCount: data.likes_count,
    isAccepted: data.is_accepted,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * 좋아요 추가/삭제
 */
export async function toggleLike(userId: string, targetType: 'post' | 'comment', targetId: string): Promise<boolean> {
  // 기존 좋아요 확인
  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116는 결과가 없는 경우
    console.error('Error checking likes:', checkError);
    return false;
  }

  // 좋아요가 이미 있으면 삭제, 없으면 추가
  if (existingLike) {
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);

    if (deleteError) {
      console.error('Error removing like:', deleteError);
      return false;
    }
    return false; // 좋아요 취소됨
  } else {
    const { error: insertError } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        target_type: targetType,
        target_id: targetId
      });

    if (insertError) {
      console.error('Error adding like:', insertError);
      return false;
    }
    return true; // 좋아요 추가됨
  }
}

// 데이터 변환 헬퍼 함수들
function transformUserData(data: any): User {
  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name,
    email: data.email,
    avatar: data.avatar,
    bio: data.bio,
    role: data.role,
    isVerified: data.is_verified,
    followers: data.followers,
    following: data.following,
    postCount: data.post_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

function transformCategoryData(data: any): Category {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    parentId: data.parent_id,
    postCount: data.post_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

// 데모용 게시물 데이터 (forum/page.tsx에서 가져옴)
const FORUM_POSTS = [
  {
    id: 1,
    title: "Next.js에서 데이터 패칭 방법 추천해주세요",
    author: "질문자123",
    date: "3시간 전",
    category: "개발/프로그래밍",
    content: "Next.js 프로젝트에서 API 데이터를 효율적으로 가져오는 방법에 대해 조언 부탁드립니다. React Query와 SWR 중 어떤 것이 더 좋을까요?",
    answers: 5,
    views: 42,
    votes: 8,
    isSolved: false,
  },
  {
    id: 2,
    title: "TypeScript와 JavaScript 중 어떤 것을 배워야 할까요?",
    author: "초보개발자",
    date: "어제",
    category: "개발/프로그래밍",
    content: "프론트엔드 개발을 시작하려고 하는데, TypeScript와 JavaScript 중 어떤 것부터 배우는 것이 좋을까요? 각각의 장단점을 알려주세요.",
    answers: 12,
    views: 128,
    votes: 15,
    isSolved: true,
  },
  {
    id: 3,
    title: "UI 디자인 트렌드 2023",
    author: "디자인러버",
    date: "2일 전",
    category: "디자인",
    content: "2023년 UI/UX 디자인 트렌드에 대해 이야기해봅시다. 어떤 스타일이 인기를 끌고 있나요?",
    answers: 8,
    views: 95,
    votes: 10,
    isSolved: false,
  },
];

// 데모용 댓글 데이터
const DEMO_COMMENTS = [
  {
    id: 101,
    postId: 1,
    content: "React Query를 추천합니다. 캐싱, 자동 리패칭, 무효화 등 다양한 기능을 제공해서 데이터 관리가 편리합니다.",
    authorId: 'user-101',
    authorName: '개발자A',
    parentId: null,
    likesCount: 3,
    isAccepted: false,
    createdAt: '2023-08-15T08:30:00Z'
  },
  {
    id: 102,
    postId: 1,
    content: "SWR도 좋은 선택입니다. Vercel에서 만들었고 Next.js와 호환성이 좋습니다. 구현이 더 간단하다는 장점이 있어요.",
    authorId: 'user-102',
    authorName: '프론트엔드개발자',
    parentId: null,
    likesCount: 5,
    isAccepted: true,
    createdAt: '2023-08-15T09:15:00Z'
  },
  {
    id: 103,
    postId: 2,
    content: "초보자라면 JavaScript부터 시작하는 것이 좋습니다. 기본 개념을 익힌 후에 TypeScript로 넘어가는 것이 학습 곡선을 완만하게 만들어줍니다.",
    authorId: 'user-103',
    authorName: '시니어개발자',
    parentId: null,
    likesCount: 8,
    isAccepted: true,
    createdAt: '2023-08-16T10:00:00Z'
  },
  {
    id: 104,
    postId: 2,
    content: "저는 바로 TypeScript를 배우는 것을 추천합니다. 타입 시스템이 많은 오류를 잡아주고 자동완성 기능도 좋아서 생산성이 높아집니다.",
    authorId: 'user-104',
    authorName: 'TS마스터',
    parentId: null,
    likesCount: 6,
    isAccepted: false,
    createdAt: '2023-08-16T12:30:00Z'
  },
  {
    id: 105,
    postId: 3,
    content: "2023년에는 뉴모피즘(Neumorphism)과 달크 모드(Dark Mode)가 계속해서 인기입니다. 또한 마이크로인터랙션이 중요해지고 있어요.",
    authorId: 'user-105',
    authorName: 'UX디자이너',
    parentId: null,
    likesCount: 4,
    isAccepted: false,
    createdAt: '2023-08-17T14:20:00Z'
  }
]; 