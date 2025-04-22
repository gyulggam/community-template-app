"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BannerAd } from "@/components/AdMob";
import { useInterstitialAd } from "@/components/AdMob";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";

// 임시 게시물 데이터
const POSTS = [
  {
    id: 1,
    title: "커뮤니티 앱 개발 경험 공유",
    content: "최근에 커뮤니티 앱을 개발하며 겪은 경험을 공유합니다...",
    author: "김개발",
    date: "3시간 전",
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    title: "Next.js 14에서 달라진 점",
    content: "Next.js 14에서 도입된 새로운 기능들에 대해 알아보겠습니다...",
    author: "이프론트",
    date: "어제",
    likes: 32,
    comments: 12,
  },
  {
    id: 3,
    title: "모바일 앱 수익화 전략",
    content: "모바일 앱 수익화를 위한 다양한 전략들을 소개합니다...",
    author: "박수익",
    date: "2일 전",
    likes: 47,
    comments: 15,
  },
  {
    id: 4,
    title: "PWA vs 네이티브 앱 비교",
    content: "PWA와 네이티브 앱의 장단점을 비교 분석합니다...",
    author: "최모바일",
    date: "3일 전",
    likes: 18,
    comments: 6,
  },
];

const CATEGORIES = [
  { id: "all", name: "전체" },
  { id: "dev", name: "개발" },
  { id: "design", name: "디자인" },
  { id: "marketing", name: "마케팅" },
];

export default function BoardPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // 인터스티셜 광고 설정
  const interstitialAd = useInterstitialAd("your-interstitial-ad-unit-id");
  
  const handlePostSubmit = () => {
    // 실제 구현에서는 게시물 저장 로직 추가
    console.log("게시물 저장:", { title, content });
    
    // 게시물 작성 후 인터스티셜 광고 표시
    if (interstitialAd.isLoaded) {
      interstitialAd.show();
    }
    
    setTitle("");
    setContent("");
    setIsDialogOpen(false);
  };
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">게시판</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>글쓰기</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 게시물 작성</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="내용을 입력하세요..."
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Button onClick={handlePostSubmit}>작성 완료</Button>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <BannerAd className="w-full" />
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {CATEGORIES.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid gap-4">
              {POSTS.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-8 h-8" />
                      <div>
                        <p className="text-sm font-medium">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{post.date}</p>
                      </div>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex gap-4">
                      <span>좋아요 {post.likes}</span>
                      <span>댓글 {post.comments}</span>
                    </div>
                    <Button variant="ghost" size="sm">자세히 보기</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 