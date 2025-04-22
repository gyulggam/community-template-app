# 커뮤니티 템플릿 앱

다양한 주제의 커뮤니티 앱을 쉽게 생성할 수 있는 템플릿 프로젝트입니다. Next.js, shadcn UI를 사용하여 개발되었으며, PWA 기능과 AdMob 통합을 지원합니다.

## 주요 기능

- 다양한 커뮤니티 템플릿 제공 (소셜, 포럼, 블로그, 커머스)
- 모바일 앱으로 배포 가능 (PWA)
- AdMob을 통한 수익 창출 기능
- 구독 모델을 통한 프리미엄 기능 제공
- 반응형 디자인으로 모든 기기에서 최적화된 경험 제공

## 기술 스택

- **프레임워크**: Next.js 14
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn UI
- **모바일 지원**: PWA (Progressive Web App)
- **광고 통합**: Google AdMob

## 시작하기

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음과 같이 설정하세요:

```
# 커뮤니티 타입 설정 (social, forum, blog, ecommerce 중 하나)
NEXT_PUBLIC_COMMUNITY_TYPE=social

# AdMob 광고 ID 설정
NEXT_PUBLIC_ADMOB_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
NEXT_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz
NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID=ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz
NEXT_PUBLIC_ADMOB_REWARDED_ID=ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz

# 개발 환경에서는 테스트 광고 ID 사용
NEXT_PUBLIC_ADMOB_TEST_DEVICE_ID=ABCDEF1234567890
```

NEXT_PUBLIC_COMMUNITY_TYPE 값을 변경하여 원하는 커뮤니티 타입을 선택할 수 있습니다.

### 설치

```bash
# 패키지 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 모드로 실행

```bash
npm run start
```

## 모바일 앱 배포

이 프로젝트는 PWA로 구성되어 있어 iOS와 Android에 모두 배포할 수 있습니다.

### iOS 배포

1. Safari에서 웹앱 접속
2. 공유 버튼 클릭
3. "홈 화면에 추가" 선택

### Android 배포

1. Chrome에서 웹앱 접속
2. 메뉴 버튼 클릭
3. "앱 설치" 또는 "홈 화면에 추가" 선택

## AdMob 통합

실제 AdMob을 사용하려면 다음 단계를 따르세요:

1. [Google AdMob](https://admob.google.com/)에서 계정 생성
2. 앱 등록 및 광고 단위 ID 발급
3. `.env.local` 파일에 발급받은 ID를 설정

개발 모드에서는 자동으로 테스트 광고 ID가 사용됩니다.

## 수익 창출 모델

이 템플릿은 다음과 같은 수익 창출 모델을 지원합니다:

1. **광고 수익**:
   - 배너 광고: 앱 내 배너 광고 표시
   - 전면 광고: 화면 전환 시 전면 광고 표시
   - 리워드 광고: 사용자가 보상을 받고 광고 시청

2. **프리미엄 구독**:
   - 월간/연간 구독 옵션 제공
   - 광고 제거 및 고급 기능 이용 가능
   - 콘텐츠 우선 접근권 제공

## 커스터마이징

원하는 주제에 맞게 템플릿을 수정하여 사용하세요. 다음 파일들을 중점적으로 수정하면 됩니다:

- `src/app/page.tsx`: 메인 화면
- `src/app/template/`: 다양한 템플릿 컴포넌트
- `src/components/Navigation.tsx`: 네비게이션 바
- `public/manifest.json`: PWA 설정
- `.env.local`: 환경 변수 설정

## 라이센스

MIT License
