"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAdMobConfig } from "@/config/admob";

export enum AdSize {
  BANNER = 'BANNER',
  LARGE_BANNER = 'LARGE_BANNER',
  MEDIUM_RECTANGLE = 'MEDIUM_RECTANGLE',
  FULL_BANNER = 'FULL_BANNER',
  LEADERBOARD = 'LEADERBOARD',
  SMART_BANNER = 'SMART_BANNER',
}

interface AdMobProps {
  unitId?: string;
  size?: AdSize;
  className?: string;
}

// 광고 ID를 환경 설정에서 가져옵니다
const adMobConfig = getAdMobConfig();

export function AdMob({ unitId, size = AdSize.BANNER, className }: AdMobProps) {
  const [isClient, setIsClient] = useState(false);
  const actualUnitId = unitId || adMobConfig.BANNER_ID;

  useEffect(() => {
    setIsClient(true);
    
    // 실제 환경에서는 AdMob SDK 초기화 코드가 여기에 추가됩니다
    if (typeof window !== 'undefined') {
      console.log(`AdMob initialized with banner ID: ${actualUnitId}`);
    }
  }, [actualUnitId]);

  if (!isClient) {
    return null;
  }

  // 실제 AdMob을 사용할 때는 react-native-google-mobile-ads 라이브러리를 사용하게 됩니다.
  // 여기서는 데모를 위해 플레이스홀더를 표시합니다.
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-2 flex items-center justify-center bg-muted">
        <div className="text-center text-xs text-muted-foreground">
          광고 영역 ({size}) - ID: {actualUnitId.substring(0, 10)}...
        </div>
      </CardContent>
    </Card>
  );
}

// 배너 광고 컴포넌트
export function BannerAd({ unitId, className }: Omit<AdMobProps, "size">) {
  return <AdMob unitId={unitId || adMobConfig.BANNER_ID} size={AdSize.BANNER} className={className} />;
}

// 인터스티셜 광고 (전면 광고) 모킹 함수
export function useInterstitialAd(unitId?: string) {
  const actualUnitId = unitId || adMobConfig.INTERSTITIAL_ID;
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // 실제 구현에서는 AdMob SDK를 사용하여 광고를 로드합니다
    console.log(`Interstitial ad loading: ${actualUnitId}`);
    
    // 로드 완료를 시뮬레이션합니다
    const timer = setTimeout(() => {
      setIsLoaded(true);
      console.log(`Interstitial ad loaded: ${actualUnitId}`);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [actualUnitId]);
  
  return {
    load: () => console.log(`인터스티셜 광고 로드: ${actualUnitId}`),
    show: () => console.log(`인터스티셜 광고 표시: ${actualUnitId}`),
    isLoaded,
  };
}

// 리워드 광고 모킹 함수
export function useRewardedAd(unitId?: string) {
  const actualUnitId = unitId || adMobConfig.REWARDED_ID;
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // 실제 구현에서는 AdMob SDK를 사용하여 광고를 로드합니다
    console.log(`Rewarded ad loading: ${actualUnitId}`);
    
    // 로드 완료를 시뮬레이션합니다
    const timer = setTimeout(() => {
      setIsLoaded(true);
      console.log(`Rewarded ad loaded: ${actualUnitId}`);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [actualUnitId]);
  
  return {
    load: () => console.log(`리워드 광고 로드: ${actualUnitId}`),
    show: () => {
      console.log(`리워드 광고 표시: ${actualUnitId}`);
      return Promise.resolve({ type: 'earned', amount: 100 });
    },
    isLoaded,
  };
} 