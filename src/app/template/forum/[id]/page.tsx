"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BannerAd, useInterstitialAd } from "@/components/AdMob";
import { Textarea } from "@/components/ui/textarea";
import { getPostById, getCommentsByPostId } from "@/db/data";
import { Post, Comment } from "@/db/models";
import { ArrowLeft, MessageSquare, ThumbsUp, Eye, Check, Calendar } from "lucide-react";

export default function ForumPostDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  
  // 광고 설정
  const interstitialAd = useInterstitialAd();
  
  useEffect(() => {
    if (params.id) {
      // 게시글 데이터 로드
      const postData = getPostById(Number(params.id));
      
      if (postData && postData.type === 'forum') {
        setPost(postData);
        
        // 댓글 데이터 로드
        const commentsData = getCommentsByPostId(Number(params.id));
        setComments(commentsData);
      } else {
        // 포럼 글이 아니거나 존재하지 않는 경우 목록으로 리다이렉트
        router.push('/template/forum');
      }
      
      setLoading(false);
    }
  }, [params.id, router]);
  
  const handleSubmitComment = () => {
    if (newComment.trim() && post) {
      // 실제 구현에서는 API 호출을 통해 댓글 저장
      console.log("댓글 저장:", { postId: post.id, content: newComment });
      
      // 인터스티셜 광고 표시
      if (interstitialAd.isLoaded) {
        interstitialAd.show();
      }
      
      setNewComment("");
      
      // 목업 댓글 추가 (실제 구현에서는 API 응답 데이터 사용)
      const mockComment: Comment = {
        id: Date.now(),
        content: newComment,
        authorId: 1, // 현재 로그인한 사용자 ID
        author: {
          id: 1,
          username: 'kimdev',
          displayName: '김개발',
          email: 'kimdev@example.com',
          avatar: '/avatars/avatar-1.png',
          role: 'admin',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        postId: post.id,
        likesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setComments([...comments, mockComment]);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-8 mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container py-8 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <p className="mb-4">게시글을 찾을 수 없습니다.</p>
          <Button asChild>
            <Link href="/template/forum">
              목록으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  return (
    <div className="container py-8 mx-auto px-4 md:px-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4"
          onClick={() => router.push('/template/forum')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로 돌아가기
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {post.category && (
                    <span className="bg-muted px-2 py-1 rounded-full text-xs">
                      {post.category.name}
                    </span>
                  )}
                  {post.isSolved && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      해결됨
                    </span>
                  )}
                </div>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10" />
              <div>
                <p className="font-semibold">{post.author?.displayName || '알 수 없음'}</p>
                <p className="text-xs text-muted-foreground">@{post.author?.username}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose max-w-none mb-4">
              <p>{post.content}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags?.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {post.likesCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {post.commentsCount}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.viewsCount}
              </span>
            </div>
            <Button variant="outline" size="sm">질문 공유하기</Button>
          </CardFooter>
        </Card>
        
        <div className="mb-8">
          <BannerAd className="w-full" />
        </div>
        
        {/* 답변/댓글 섹션 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">답변 ({comments.length})</h2>
          
          {/* 새 답변 입력창 */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Textarea
                placeholder="답변을 작성해주세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="mb-4"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  답변 작성하기
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* 답변 목록 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className={comment.isAccepted ? "border-green-300" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8" />
                      <div>
                        <p className="font-semibold">{comment.author?.displayName || '알 수 없음'}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    {comment.isAccepted && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        채택된 답변
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{comment.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex gap-4 text-sm">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likesCount}</span>
                    </Button>
                  </div>
                  {!post.isSolved && !comment.isAccepted && (
                    <Button variant="outline" size="sm">채택하기</Button>
                  )}
                </CardFooter>
              </Card>
            ))}
            
            {comments.length === 0 && (
              <div className="flex items-center justify-center py-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">아직 답변이 없습니다. 첫 번째 답변을 작성해보세요!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 관련 질문 */}
        <div>
          <h2 className="text-xl font-bold mb-4">관련 질문</h2>
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">TypeScript와 JavaScript의 성능 차이가 있나요?</CardTitle>
              </CardHeader>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    5
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    87
                  </span>
                </div>
                <span>2일 전</span>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Next.js 13에서 14로 마이그레이션 팁</CardTitle>
              </CardHeader>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    8
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    112
                  </span>
                </div>
                <span>4일 전</span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 