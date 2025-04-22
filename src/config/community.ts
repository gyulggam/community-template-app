export type CommunityType = 'social' | 'forum' | 'blog' | 'ecommerce';

interface CommunityConfig {
  type: CommunityType;
  title: string;
  description: string;
}

// 환경 변수에서 커뮤니티 타입을 가져옵니다. 설정되지 않은 경우 'social'을 기본값으로 사용합니다.
export const getCommunityType = (): CommunityType => {
  const envType = process.env.NEXT_PUBLIC_COMMUNITY_TYPE as CommunityType;
  if (['social', 'forum', 'blog', 'ecommerce'].includes(envType)) {
    return envType;
  }
  return 'social'; // 기본값
};

// 커뮤니티 타입별 설정
export const communityConfigs: Record<CommunityType, CommunityConfig> = {
  social: {
    type: 'social',
    title: '소셜 커뮤니티',
    description: '사용자들이 서로 소통하고 콘텐츠를 공유할 수 있는 소셜 미디어 형태의 커뮤니티입니다.',
  },
  forum: {
    type: 'forum',
    title: '포럼형 커뮤니티',
    description: '질문과 답변, 토론을 중심으로 지식을 공유하는 포럼형 커뮤니티입니다.',
  },
  blog: {
    type: 'blog',
    title: '블로그형 커뮤니티',
    description: '사용자들이 자신의 이야기나 전문 지식을 긴 글로 공유하는 블로그형 커뮤니티입니다.',
  },
  ecommerce: {
    type: 'ecommerce',
    title: '커머스 커뮤니티',
    description: '상품 거래와 리뷰를 중심으로 하는 커머스 기반 커뮤니티입니다.',
  },
};

// 현재 커뮤니티 설정
export const getCurrentCommunityConfig = (): CommunityConfig => {
  const communityType = getCommunityType();
  return communityConfigs[communityType];
}; 