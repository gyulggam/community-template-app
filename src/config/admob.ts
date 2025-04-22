// AdMob 설정

// 테스트 환경에서 사용할 테스트 광고 ID
const TEST_AD_UNIT_IDS = {
  APP_ID: 'ca-app-pub-3940256099942544~3347511713',
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
};

// 프로덕션에서 사용할 실제 광고 ID
interface AdMobConfig {
  APP_ID: string;
  BANNER_ID: string;
  INTERSTITIAL_ID: string;
  REWARDED_ID: string;
  TEST_DEVICE_ID: string;
}

// 개발 모드인지 확인
const isDevelopment = process.env.NODE_ENV === 'development';

// 환경 변수에서 AdMob 설정 가져오기
export const getAdMobConfig = (): AdMobConfig => {
  return {
    APP_ID: isDevelopment 
      ? TEST_AD_UNIT_IDS.APP_ID 
      : process.env.NEXT_PUBLIC_ADMOB_APP_ID || '',
    BANNER_ID: isDevelopment 
      ? TEST_AD_UNIT_IDS.BANNER 
      : process.env.NEXT_PUBLIC_ADMOB_BANNER_ID || '',
    INTERSTITIAL_ID: isDevelopment 
      ? TEST_AD_UNIT_IDS.INTERSTITIAL 
      : process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID || '',
    REWARDED_ID: isDevelopment 
      ? TEST_AD_UNIT_IDS.REWARDED 
      : process.env.NEXT_PUBLIC_ADMOB_REWARDED_ID || '',
    TEST_DEVICE_ID: process.env.NEXT_PUBLIC_ADMOB_TEST_DEVICE_ID || '',
  };
}; 