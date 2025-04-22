"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BannerAd } from "@/components/AdMob";
import Link from "next/link";
import { getCommunityType, communityConfigs } from "@/config/community";
import EnvInfo from "@/components/EnvInfo";

const TEMPLATES = [
  {
    id: "social",
    title: "소셜 커뮤니티",
    description: "사용자들이 서로 소통하고 콘텐츠를 공유할 수 있는 소셜 미디어 형태의 커뮤니티입니다.",
    route: "/template/social",
  },
  {
    id: "forum",
    title: "포럼형 커뮤니티",
    description: "질문과 답변, 토론을 중심으로 지식을 공유하는 포럼형 커뮤니티입니다.",
    route: "/template/forum",
  },
  {
    id: "blog",
    title: "블로그형 커뮤니티",
    description: "사용자들이 자신의 이야기나 전문 지식을 긴 글로 공유하는 블로그형 커뮤니티입니다.",
    route: "/template/blog",
  },
  {
    id: "ecommerce",
    title: "커머스 커뮤니티",
    description: "상품 거래와 리뷰를 중심으로 하는 커머스 기반 커뮤니티입니다.",
    route: "/template/ecommerce",
  },
];

export default function Home() {
  const router = useRouter();
  const communityType = getCommunityType();
  
  // 환경 변수에 지정된 커뮤니티 타입이 있으면 해당 템플릿으로 리다이렉트
  useEffect(() => {
    if (communityType) {
      const template = TEMPLATES.find(t => t.id === communityType);
      if (template) {
        router.push(template.route);
      }
    }
  }, [communityType, router]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">커뮤니티 템플릿</h1>
      <p className="text-muted-foreground mb-8">
        다양한 주제의 커뮤니티 앱을 쉽게 생성할 수 있는 템플릿을 제공합니다.
      </p>
      
      <div className="mb-8">
        <BannerAd className="w-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <Card key={template.id} className={`overflow-hidden ${template.id === communityType ? 'border-primary' : ''}`}>
            <CardHeader>
              <CardTitle>{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full" variant={template.id === communityType ? "default" : "outline"}>
                <Link href={template.route}>
                  {template.id === communityType ? '현재 선택됨' : '선택하기'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">수익 창출 모델</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>광고 수익</CardTitle>
              <CardDescription>AdMob을 통한 배너, 전면, 리워드 광고로 수익을 창출합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>배너 광고: 앱 내 배너 광고 표시</li>
                <li>전면 광고: 화면 전환 시 전면 광고 표시</li>
                <li>리워드 광고: 사용자가 보상을 받고 광고 시청</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>프리미엄 구독</CardTitle>
              <CardDescription>광고 제거 및 추가 기능 이용을 위한 구독 모델을 제공합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>월간/연간 구독 옵션 제공</li>
                <li>광고 제거 및 고급 기능 이용 가능</li>
                <li>콘텐츠 우선 접근권 제공</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <EnvInfo />
    </div>
  );
}
