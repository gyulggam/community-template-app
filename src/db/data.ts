import { User, Post, Comment, Category, Tag } from './models';

// 사용자 더미 데이터
export const users: User[] = [
  {
    id: 1,
    username: 'kimdev',
    displayName: '김개발',
    email: 'kimdev@example.com',
    avatar: '/avatars/avatar-1.png',
    bio: '풀스택 개발자 | Next.js, React, Node.js',
    role: 'admin',
    isVerified: true,
    followers: 120,
    following: 85,
    postCount: 42,
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-01-15T08:00:00Z',
  },
  {
    id: 2,
    username: 'leedesign',
    displayName: '이디자인',
    email: 'leedesign@example.com',
    avatar: '/avatars/avatar-2.png',
    bio: 'UI/UX 디자이너 | 웹 & 모바일 디자인',
    role: 'user',
    isVerified: true,
    followers: 230,
    following: 150,
    postCount: 28,
    createdAt: '2023-02-20T10:12:00Z',
    updatedAt: '2023-02-20T10:12:00Z',
  },
  {
    id: 3,
    username: 'parkfrontend',
    displayName: '박프론트',
    email: 'parkfrontend@example.com',
    avatar: '/avatars/avatar-3.png',
    bio: '프론트엔드 개발자 | React, TypeScript 전문',
    role: 'user',
    isVerified: true,
    followers: 95,
    following: 120,
    postCount: 16,
    createdAt: '2023-03-10T14:25:00Z',
    updatedAt: '2023-03-10T14:25:00Z',
  },
  {
    id: 4,
    username: 'choibackend',
    displayName: '최백엔드',
    email: 'choibackend@example.com',
    avatar: '/avatars/avatar-4.png',
    bio: '백엔드 개발자 | Node.js, Go, AWS',
    role: 'moderator',
    isVerified: true,
    followers: 88,
    following: 53,
    postCount: 20,
    createdAt: '2023-02-05T09:35:00Z',
    updatedAt: '2023-02-05T09:35:00Z',
  },
  {
    id: 5,
    username: 'jeongmarketer',
    displayName: '정마케터',
    email: 'jeongmarketer@example.com',
    avatar: '/avatars/avatar-5.png',
    bio: '디지털 마케팅 전문가 | SEO, SEM, 소셜 미디어',
    role: 'user',
    isVerified: true,
    followers: 175,
    following: 92,
    postCount: 34,
    createdAt: '2023-04-18T11:42:00Z',
    updatedAt: '2023-04-18T11:42:00Z',
  },
];

// 카테고리 더미 데이터
export const categories: Category[] = [
  {
    id: 1,
    name: '개발/프로그래밍',
    slug: 'programming',
    description: '개발 및 프로그래밍 관련 토픽',
    parentId: null,
    postCount: 89,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: '디자인',
    slug: 'design',
    description: 'UI/UX 및 그래픽 디자인 관련 토픽',
    parentId: null,
    postCount: 56,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: '마케팅',
    slug: 'marketing',
    description: '디지털 마케팅 및 광고 관련 토픽',
    parentId: null,
    postCount: 42,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: '비즈니스',
    slug: 'business',
    description: '창업 및 비즈니스 관련 토픽',
    parentId: null,
    postCount: 37,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: '웹 개발',
    slug: 'web-dev',
    description: '웹 개발 관련 토픽',
    parentId: 1,
    postCount: 45,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

// 태그 더미 데이터
export const tags: Tag[] = [
  {
    id: 1,
    name: 'JavaScript',
    slug: 'javascript',
    postCount: 78,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'React',
    slug: 'react',
    postCount: 64,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'TypeScript',
    slug: 'typescript',
    postCount: 45,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'UI/UX',
    slug: 'ui-ux',
    postCount: 38,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'Next.js',
    slug: 'nextjs',
    postCount: 29,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

// 게시글 더미 데이터
export const posts: Post[] = [
  // 소셜 타입 게시글
  {
    id: 1,
    title: undefined,
    content: "오늘 새로운 프로젝트를 시작했습니다! 앞으로의 여정이 기대되네요 😊",
    authorId: 1,
    author: users.find(u => u.id === 1),
    type: 'social',
    status: 'published',
    tags: ['개발', '프로젝트'],
    likesCount: 24,
    commentsCount: 5,
    viewsCount: 56,
    images: [],
    createdAt: '2023-05-25T08:30:00Z',
    updatedAt: '2023-05-25T08:30:00Z',
  },
  {
    id: 2,
    title: undefined,
    content: "주말에 열린 개발자 컨퍼런스에 다녀왔습니다. 많은 인사이트를 얻었어요! #개발자컨퍼런스 #기술트렌드",
    authorId: 2,
    author: users.find(u => u.id === 2),
    type: 'social',
    status: 'published',
    tags: ['컨퍼런스', '개발', '기술트렌드'],
    likesCount: 42,
    commentsCount: 8,
    viewsCount: 128,
    images: [],
    createdAt: '2023-05-24T14:20:00Z',
    updatedAt: '2023-05-24T14:20:00Z',
  },
  {
    id: 3,
    title: undefined,
    content: "새로운 UI 디자인 트렌드에 대한 생각을 공유합니다. 미니멀리즘이 계속해서 강세를 보이고 있네요.",
    authorId: 3,
    author: users.find(u => u.id === 3),
    type: 'social',
    status: 'published',
    tags: ['디자인', 'UI', '트렌드'],
    likesCount: 18,
    commentsCount: 12,
    viewsCount: 87,
    images: [],
    createdAt: '2023-05-23T11:15:00Z',
    updatedAt: '2023-05-23T11:15:00Z',
  },
  
  // 포럼 타입 게시글
  {
    id: 4,
    title: "Next.js에서 데이터 패칭 방법 추천해주세요",
    content: "Next.js 프로젝트에서 API 데이터를 효율적으로 가져오는 방법에 대해 조언 부탁드립니다. React Query와 SWR 중 어떤 것이 더 좋을까요?",
    authorId: 4,
    author: users.find(u => u.id === 4),
    categoryId: 5,
    category: categories.find(c => c.id === 5),
    type: 'forum',
    status: 'published',
    tags: ['Next.js', 'API', 'React'],
    likesCount: 8,
    commentsCount: 5,
    viewsCount: 42,
    isSolved: false,
    createdAt: '2023-05-26T09:45:00Z',
    updatedAt: '2023-05-26T09:45:00Z',
  },
  {
    id: 5,
    title: "TypeScript와 JavaScript 중 어떤 것을 배워야 할까요?",
    content: "프론트엔드 개발을 시작하려고 하는데, TypeScript와 JavaScript 중 어떤 것부터 배우는 것이 좋을까요? 각각의 장단점을 알려주세요.",
    authorId: 5,
    author: users.find(u => u.id === 5),
    categoryId: 1,
    category: categories.find(c => c.id === 1),
    type: 'forum',
    status: 'published',
    tags: ['TypeScript', 'JavaScript', '프론트엔드'],
    likesCount: 15,
    commentsCount: 12,
    viewsCount: 128,
    isSolved: true,
    acceptedAnswerId: 2,
    createdAt: '2023-05-22T16:30:00Z',
    updatedAt: '2023-05-22T16:30:00Z',
  },
  {
    id: 6,
    title: "UI 디자인 트렌드 2023",
    content: "2023년 UI/UX 디자인 트렌드에 대해 이야기해봅시다. 어떤 스타일이 인기를 끌고 있나요?",
    authorId: 2,
    author: users.find(u => u.id === 2),
    categoryId: 2,
    category: categories.find(c => c.id === 2),
    type: 'forum',
    status: 'published',
    tags: ['디자인', 'UI/UX', '트렌드'],
    likesCount: 10,
    commentsCount: 8,
    viewsCount: 95,
    isSolved: false,
    createdAt: '2023-05-20T14:15:00Z',
    updatedAt: '2023-05-20T14:15:00Z',
  },
  
  // 블로그 타입 게시글
  {
    id: 7,
    title: "React 18에서 달라진 점과 주의사항",
    content: `
# React 18에서 달라진 점과 주의사항

React 18이 공식 릴리즈되었습니다! 이번 릴리즈에는 많은 변화와 개선사항이 포함되어 있습니다.

## 주요 변경사항

1. **자동 배치 처리 개선**
   여러 상태 업데이트를 하나의 리렌더링으로 그룹화하는 기능이 향상되었습니다.

2. **동시성 렌더링**
   새로운 동시성 렌더링 기능을 통해 UI 업데이트의 우선순위를 설정할 수 있습니다.

3. **새로운 훅 추가**
   useTransition, useDeferredValue 등 새로운 훅이 추가되었습니다.

## 마이그레이션 시 주의사항

- React 17에서 작동하던 일부 패턴이 React 18에서 다르게 작동할 수 있습니다.
- 타입스크립트 사용자는 타입 정의를 업데이트해야 합니다.

자세한 내용은 [React 공식 문서](https://reactjs.org)를 참조하세요.
    `,
    authorId: 1,
    author: users.find(u => u.id === 1),
    categoryId: 1,
    category: categories.find(c => c.id === 1),
    type: 'blog',
    status: 'published',
    tags: ['React', 'JavaScript', '프론트엔드'],
    likesCount: 35,
    commentsCount: 7,
    viewsCount: 245,
    excerpt: "React 18에서 달라진 주요 기능과 마이그레이션 시 주의사항을 알아봅니다.",
    readingTime: 5,
    createdAt: '2023-05-15T10:20:00Z',
    updatedAt: '2023-05-15T10:20:00Z',
  },
  {
    id: 8,
    title: "효율적인 상태 관리를 위한 5가지 팁",
    content: `
# 효율적인 상태 관리를 위한 5가지 팁

복잡한 애플리케이션을 개발하다 보면 상태 관리의 중요성을 깨닫게 됩니다. 이 글에서는 효율적인 상태 관리를 위한 5가지 팁을 소개합니다.

## 1. 상태를 최소화하세요

필요한 상태만 관리하고, 파생 데이터는 계산하세요. 불필요한 상태는 버그의 원인이 됩니다.

## 2. 적절한 범위에 상태를 위치시키세요

전역 상태는 꼭 필요한 경우에만 사용하고, 가능하면 지역 상태를 활용하세요.

## 3. 불변성을 유지하세요

상태를 직접 수정하지 말고, 항상 새로운 상태를 반환하세요.

## 4. 비동기 상태 관리에 주의하세요

로딩 상태, 에러 상태 등 비동기 처리 시 필요한 상태를 적절히 관리하세요.

## 5. 개발자 도구를 활용하세요

Redux DevTools, React DevTools 등을 활용해 상태 변화를 추적하세요.
    `,
    authorId: 3,
    author: users.find(u => u.id === 3),
    categoryId: 1,
    category: categories.find(c => c.id === 1),
    type: 'blog',
    status: 'published',
    tags: ['React', '상태관리', 'JavaScript'],
    likesCount: 42,
    commentsCount: 9,
    viewsCount: 310,
    excerpt: "복잡한 애플리케이션 개발 시 효율적인 상태 관리를 위한 5가지 팁을 소개합니다.",
    readingTime: 7,
    createdAt: '2023-05-10T09:15:00Z',
    updatedAt: '2023-05-10T09:15:00Z',
  },
  
  // 커머스 타입 게시글
  {
    id: 9,
    title: "개발자를 위한 인체공학적 키보드",
    content: "장시간 코딩에 최적화된 인체공학적 키보드입니다. 손목 통증 완화와 타이핑 속도 향상에 도움을 줍니다.",
    authorId: 4,
    author: users.find(u => u.id === 4),
    categoryId: 4,
    category: categories.find(c => c.id === 4),
    type: 'ecommerce',
    status: 'published',
    tags: ['키보드', '인체공학', '개발자용품'],
    likesCount: 12,
    commentsCount: 4,
    viewsCount: 180,
    price: 129000,
    availability: 'in_stock',
    createdAt: '2023-05-18T08:40:00Z',
    updatedAt: '2023-05-18T08:40:00Z',
  },
  {
    id: 10,
    title: "프로그래머를 위한 집중력 향상 음악 컬렉션",
    content: "코딩에 집중하기 위한 로파이 음악 컬렉션입니다. 백색 소음과 차분한 멜로디로 구성되어 있습니다.",
    authorId: 5,
    author: users.find(u => u.id === 5),
    categoryId: 4,
    category: categories.find(c => c.id === 4),
    type: 'ecommerce',
    status: 'published',
    tags: ['음악', '집중력', '개발자'],
    likesCount: 8,
    commentsCount: 2,
    viewsCount: 95,
    price: 9900,
    availability: 'in_stock',
    createdAt: '2023-05-12T13:25:00Z',
    updatedAt: '2023-05-12T13:25:00Z',
  },
];

// 댓글 더미 데이터
export const comments: Comment[] = [
  // 소셜 게시글 댓글
  {
    id: 1,
    content: "새 프로젝트 응원합니다! 어떤 프로젝트인지 궁금하네요.",
    authorId: 2,
    author: users.find(u => u.id === 2),
    postId: 1,
    likesCount: 3,
    createdAt: '2023-05-25T09:15:00Z',
    updatedAt: '2023-05-25T09:15:00Z',
  },
  {
    id: 2,
    content: "컨퍼런스 어땠나요? 다음에 저도 참여하고 싶어요!",
    authorId: 1,
    author: users.find(u => u.id === 1),
    postId: 2,
    likesCount: 1,
    createdAt: '2023-05-24T15:30:00Z',
    updatedAt: '2023-05-24T15:30:00Z',
  },
  
  // 포럼 게시글 댓글
  {
    id: 3,
    content: "저는 SWR을 추천합니다. Next.js와 통합이 잘 되어 있고, 사용법도 간단합니다.",
    authorId: 1,
    author: users.find(u => u.id === 1),
    postId: 4,
    likesCount: 5,
    createdAt: '2023-05-26T10:20:00Z',
    updatedAt: '2023-05-26T10:20:00Z',
  },
  {
    id: 4,
    content: "JavaScript를 먼저 배우고 그 다음에 TypeScript로 넘어가는 것을 추천합니다. 기초가 잡히면 타입의 장점을 더 잘 이해할 수 있어요.",
    authorId: 3,
    author: users.find(u => u.id === 3),
    postId: 5,
    likesCount: 7,
    isAccepted: true,
    createdAt: '2023-05-22T17:15:00Z',
    updatedAt: '2023-05-22T17:15:00Z',
  },
  
  // 블로그 게시글 댓글
  {
    id: 5,
    content: "좋은 정보 감사합니다! React 18의 동시성 렌더링 기능이 특히 흥미롭네요.",
    authorId: 4,
    author: users.find(u => u.id === 4),
    postId: 7,
    likesCount: 4,
    createdAt: '2023-05-15T11:30:00Z',
    updatedAt: '2023-05-15T11:30:00Z',
  },
  {
    id: 6,
    content: "상태 관리에 대한 명쾌한 설명 감사합니다. 실제 프로젝트에서 바로 적용해 보겠습니다.",
    authorId: 2,
    author: users.find(u => u.id === 2),
    postId: 8,
    likesCount: 6,
    createdAt: '2023-05-10T10:45:00Z',
    updatedAt: '2023-05-10T10:45:00Z',
  },
  
  // 커머스 게시글 댓글
  {
    id: 7,
    content: "이 키보드 사용 중인데 정말 좋아요! 손목 통증이 많이 줄었습니다.",
    authorId: 5,
    author: users.find(u => u.id === 5),
    postId: 9,
    likesCount: 2,
    createdAt: '2023-05-18T10:20:00Z',
    updatedAt: '2023-05-18T10:20:00Z',
  },
];

// 특정 게시물 ID로 게시물 찾기
export function getPostById(id: number) {
  return posts.find(post => post.id === id);
}

// 특정 게시물에 대한 댓글 가져오기
export function getCommentsByPostId(postId: number) {
  return comments.filter(comment => comment.postId === postId);
}

// 특정 유저 ID로 유저 정보 찾기
export function getUserById(id: number) {
  return users.find(user => user.id === id);
}

// 특정 카테고리에 해당하는 게시물 가져오기
export function getPostsByCategory(categoryId: number) {
  return posts.filter(post => post.categoryId === categoryId);
}

// 특정 타입의 게시물 가져오기 (forum, social, blog, ecommerce 등)
export function getPostsByType(type: string) {
  return posts.filter(post => post.type === type);
}

// 태그로 게시물 검색
export function getPostsByTag(tag: string) {
  return posts.filter(post => post.tags && post.tags.includes(tag));
}

// 사용자가 작성한 게시물 가져오기
export function getPostsByAuthor(authorId: number) {
  return posts.filter(post => post.authorId === authorId);
}

// 사용자가 작성한 댓글 가져오기
export function getCommentsByAuthor(authorId: number) {
  return comments.filter(comment => comment.authorId === authorId);
} 