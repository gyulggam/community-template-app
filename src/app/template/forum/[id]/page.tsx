"use client";

import { useEffect, useState, useCallback } from "react";
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
import { getPostById, getCommentsByPostId, incrementPostViews, createComment } from "@/db/supabase-helper";
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
  
  // 게시글 데이터 로드
  const loadPostData = useCallback(async () => {
    if (params.id) {
      try {
        const postData = await getPostById(params.id as string);
        
        if (postData && postData.type === 'forum') {
          setPost(postData);
          
          // 조회수 증가
          incrementPostViews(params.id as string);
          
          // 댓글 데이터 로드
          const commentsData = await getCommentsByPostId(params.id as string);
          setComments(commentsData);
        } else {
          // 포럼 글이 아니거나 존재하지 않는 경우 목록으로 리다이렉트
          router.push('/template/forum');
        }
      } catch (error) {
        console.error('Error loading post data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [params.id, router]);
  
  useEffect(() => {
    loadPostData();
  }, [loadPostData]);
  
  const handleSubmitComment = async () => {
    if (newComment.trim() && post) {
      try {
        // 새 댓글 생성
        const result = await createComment({
          content: newComment,
          authorId: 'guest-user-id', // 실제 구현에서는 로그인한 사용자 ID 사용
          postId: post.id,
          likesCount: 0,
          isAccepted: false
        });
        
        // 인터스티셜 광고 표시
        if (interstitialAd.isLoaded) {
          interstitialAd.show();
        }
        
        setNewComment("");
        
        if (result) {
          // 댓글 목록에 새 댓글 추가
          setComments([...comments, result]);
        }
      } catch (error) {
        console.error('Error creating comment:', error);
      }
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
                        <p className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    {comment.isAccepted && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        채택된 답변
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{comment.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex gap-4 text-sm">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likesCount}</span>
                    </Button>
                  </div>
                  {!comment.isAccepted && post.author?.id === 'current-user-id' && (
                    <Button variant="outline" size="sm">답변 채택하기</Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 