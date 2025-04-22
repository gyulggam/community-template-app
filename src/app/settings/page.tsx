"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BannerAd, useRewardedAd } from "@/components/AdMob";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SettingsPage() {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [themeName, setThemeName] = useState("시스템");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [premiumStatus, setPremiumStatus] = useState("무료");
  
  // 리워드 광고 설정
  const rewardedAd = useRewardedAd();
  
  const handleWatchAd = () => {
    if (rewardedAd.isLoaded) {
      rewardedAd.show();
      // 실제 앱에서는 광고 시청 완료 후 콜백으로 포인트 지급 처리
      setTimeout(() => {
        toast.success("100 포인트가 지급되었습니다!");
      }, 1000);
    }
  };
  
  const handlePurchasePremium = () => {
    // 실제 앱에서는 인앱 결제 처리
    toast.success("프리미엄 구독이 활성화되었습니다!");
    setPremiumStatus("프리미엄");
    setAdsEnabled(false);
  };
  
  const themes = [
    { id: "system", name: "시스템" },
    { id: "light", name: "라이트" },
    { id: "dark", name: "다크" },
  ];
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">설정</h1>
      
      <div className="mb-8">
        <BannerAd className="w-full" />
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">일반</TabsTrigger>
          <TabsTrigger value="premium">프리미엄</TabsTrigger>
          <TabsTrigger value="app">앱 정보</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>테마 설정</CardTitle>
                <CardDescription>앱의 테마를 설정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {themes.map((theme) => (
                  <div key={theme.id} className="flex items-center justify-between">
                    <Label htmlFor={`theme-${theme.id}`}>{theme.name}</Label>
                    <input
                      type="radio"
                      id={`theme-${theme.id}`}
                      name="theme"
                      checked={themeName === theme.name}
                      onChange={() => setThemeName(theme.name)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
                <CardDescription>앱 알림을 설정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">알림 활성화</Label>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="premium">
          <Card>
            <CardHeader>
              <CardTitle>프리미엄 구독</CardTitle>
              <CardDescription>
                프리미엄 구독으로 광고 없이 더 많은 기능을 사용하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label>현재 상태</Label>
                  <span className={`font-medium ${premiumStatus === "프리미엄" ? "text-primary" : ""}`}>
                    {premiumStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ads">광고 표시</Label>
                  <Switch
                    id="ads"
                    checked={adsEnabled}
                    onCheckedChange={setAdsEnabled}
                    disabled={premiumStatus !== "프리미엄"}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                className="w-full" 
                onClick={handlePurchasePremium}
                disabled={premiumStatus === "프리미엄"}
              >
                프리미엄 구독하기 (월 5,000원)
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleWatchAd}
              >
                광고 시청하고 100 포인트 받기
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="app">
          <Card>
            <CardHeader>
              <CardTitle>앱 정보</CardTitle>
              <CardDescription>
                앱 버전 및 관련 정보를 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex justify-between">
                <span>앱 버전</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>개발자</span>
                <span>커뮤니티 템플릿 팀</span>
              </div>
              <div className="flex justify-between">
                <span>라이센스</span>
                <span>MIT</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">피드백 보내기</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 