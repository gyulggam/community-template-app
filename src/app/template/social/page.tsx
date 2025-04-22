"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BannerAd } from "@/components/AdMob";

// 가상의 게시물 데이터
const POSTS = [
  {
    id: 1,
    author: "김소셜",
    avatar: "",
    content: "오늘 새로운 프로젝트를 시작했습니다! 앞으로의 여정이 기대되네요 😊",
    likes: 24,
    comments: 5,
    time: "2시간 전",
    images: [],
  },
  {
    id: 2,
    author: "이커뮤니티",
    avatar: "",
    content: "주말에 열린 개발자 컨퍼런스에 다녀왔습니다. 많은 인사이트를 얻었어요! #개발자컨퍼런스 #기술트렌드",
    likes: 42,
    comments: 8,
    time: "5시간 전",
    images: [],
  },
  {
    id: 3,
    author: "박디자인",
    avatar: "",
    content: "새로운 UI 디자인 트렌드에 대한 생각을 공유합니다. 미니멀리즘이 계속해서 강세를 보이고 있네요.",
    likes: 18,
    comments: 12,
    time: "어제",
    images: [],
  },
];

export default function SocialTemplate() {
  const [postContent, setPostContent] = useState("");
  
  const handlePostSubmit = () => {
    console.log("게시물 작성:", postContent);
    setPostContent("");
  };
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">소셜 커뮤니티</h1>
        <Button asChild variant="outline">
          <Link href="/">
            다른 템플릿 보기
          </Link>
        </Button>
      </div>
      
      <div className="mb-6">
        <BannerAd className="w-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 사이드바 - 프로필 영역 */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">내 프로필</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4" />
              <h3 className="text-xl font-bold mb-1">사용자 이름</h3>
              <p className="text-muted-foreground text-sm mb-4">@username</p>
              <div className="w-full flex justify-between text-center">
                <div>
                  <p className="font-bold">120</p>
                  <p className="text-xs text-muted-foreground">팔로워</p>
                </div>
                <div>
                  <p className="font-bold">85</p>
                  <p className="text-xs text-muted-foreground">팔로잉</p>
                </div>
                <div>
                  <p className="font-bold">42</p>
                  <p className="text-xs text-muted-foreground">게시물</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">프로필 편집</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* 메인 컨텐츠 영역 */}
        <div className="md:col-span-2">
          {/* 게시물 작성 카드 */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4 mb-4">
                <Avatar className="w-10 h-10" />
                <Textarea
                  placeholder="무슨 생각을 하고 계신가요?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="resize-none"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">사진</Button>
                  <Button variant="outline" size="sm">동영상</Button>
                </div>
                <Button 
                  onClick={handlePostSubmit}
                  disabled={!postContent.trim()}
                >
                  게시하기
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* 게시물 목록 */}
          <div className="space-y-6">
            {POSTS.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10" />
                    <div>
                      <p className="font-semibold">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{post.content}</p>
                  {post.images.length > 0 && (
                    <div className="bg-muted h-40 flex items-center justify-center rounded">
                      <p className="text-muted-foreground">이미지 영역</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <span>좋아요</span>
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <span>댓글</span>
                      <span>{post.comments}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">공유</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 