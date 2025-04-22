"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCommunityType } from "@/config/community";
import { getAdMobConfig } from "@/config/admob";

export default function EnvInfo() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  const communityType = getCommunityType();
  const adMobConfig = getAdMobConfig();
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>환경 설정 정보</CardTitle>
        <CardDescription>현재 설정된 환경 변수 정보입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">커뮤니티 타입</h3>
            <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
              {communityType}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">AdMob 설정</h3>
            <div className="grid gap-1 mt-1">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">APP ID:</span>
                <code className="text-xs bg-muted p-1 rounded">
                  {adMobConfig.APP_ID.substring(0, 15)}...
                </code>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">BANNER ID:</span>
                <code className="text-xs bg-muted p-1 rounded">
                  {adMobConfig.BANNER_ID.substring(0, 15)}...
                </code>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">INTERSTITIAL ID:</span>
                <code className="text-xs bg-muted p-1 rounded">
                  {adMobConfig.INTERSTITIAL_ID.substring(0, 15)}...
                </code>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">REWARDED ID:</span>
                <code className="text-xs bg-muted p-1 rounded">
                  {adMobConfig.REWARDED_ID.substring(0, 15)}...
                </code>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">개발 환경</h3>
            <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
              {process.env.NODE_ENV}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 