"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BannerAd, useInterstitialAd } from "@/components/AdMob";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// 가상의 게시물 데이터
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

// 카테고리
const CATEGORIES = [
  { id: "all", name: "전체" },
  { id: "programming", name: "개발/프로그래밍" },
  { id: "design", name: "디자인" },
  { id: "marketing", name: "마케팅" },
  { id: "business", name: "비즈니스" },
];

export default function ForumTemplate() {
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("programming");
  
  // 인터스티셜 광고 설정
  const interstitialAd = useInterstitialAd();
  
  const handlePostSubmit = () => {
    // 실제 구현에서는 게시물 저장 로직 추가
    console.log("질문 작성:", { title, content, category });
    
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
        <h1 className="text-3xl font-bold">포럼형 커뮤니티</h1>
        <Button asChild variant="outline">
          <Link href="/">
            다른 템플릿 보기
          </Link>
        </Button>
      </div>
      
      <div className="mb-8">
        <BannerAd className="w-full" />
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4 items-center">
          <h2 className="text-2xl font-bold">질문 & 답변</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">최신순</Button>
            <Button variant="outline" size="sm">인기순</Button>
            <Button variant="outline" size="sm">미해결</Button>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>질문하기</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>새 질문 작성</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="category">카테고리</label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.filter(c => c.id !== "all").map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="title">제목</label>
                <Input
                  id="title"
                  placeholder="질문의 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="content">내용</label>
                <Textarea
                  id="content"
                  placeholder="질문 내용을 자세히 작성해주세요..."
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handlePostSubmit}>질문 등록하기</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          {CATEGORIES.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="space-y-4">
        {FORUM_POSTS.map((post) => (
          <Card key={post.id} className={post.isSolved ? "border-green-200" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/template/forum/${post.id}`}>
                    <CardTitle className="hover:text-primary cursor-pointer">
                      {post.title}
                    </CardTitle>
                  </Link>
                  <CardDescription className="mt-2">
                    <span className="bg-muted px-2 py-1 rounded-full text-xs mr-2">
                      {post.category}
                    </span>
                    {post.isSolved && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        해결됨
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="w-6 h-6" />
                    <span>{post.author}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-muted-foreground">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>답변 {post.answers}</span>
                <span>조회 {post.views}</span>
                <span>추천 {post.votes}</span>
              </div>
              <Link href={`/template/forum/${post.id}`}>
                <Button variant="outline" size="sm">상세보기</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            &lt;
          </Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="icon">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
} 