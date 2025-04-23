"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Home, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  const routes = [
    { href: "/", label: "홈", icon: Home },
    { href: "/board", label: "게시판", icon: Users },
    { href: "/settings", label: "설정", icon: Settings },
  ];
  
  // 사용자 이메일에서 이니셜 추출
  const getUserInitials = (email: string) => {
    if (!email) return "?";
    const parts = email.split("@");
    if (parts.length > 0) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return "?";
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">커뮤니티 템플릿</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center text-lg font-medium transition-colors hover:text-primary ${
                    pathname === route.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {route.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* 로그인/회원가입 버튼 또는 사용자 아바타 */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <span className="text-sm text-muted-foreground">로딩 중...</span>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                    <AvatarFallback>{getUserInitials(user.email || '')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">프로필</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">설정</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/register">회원가입</Link>
              </Button>
            </>
          )}
        </div>
        
        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-6">
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center text-lg font-medium transition-colors hover:text-primary ${
                        pathname === route.href
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {route.label}
                    </Link>
                  );
                })}
                
                {/* 모바일 메뉴의 로그인/로그아웃 항목 */}
                <div className="mt-4 pt-4 border-t">
                  {isLoading ? (
                    <span className="text-sm text-muted-foreground">로딩 중...</span>
                  ) : user ? (
                    <>
                      <div className="flex items-center mb-4">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                          <AvatarFallback>{getUserInitials(user.email || '')}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center text-lg font-medium transition-colors hover:text-primary text-muted-foreground"
                      >
                        프로필
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                        className="flex items-center text-lg font-medium transition-colors hover:text-red-500 text-muted-foreground mt-2"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        로그아웃
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="flex items-center text-lg font-medium transition-colors hover:text-primary text-muted-foreground mb-2"
                      >
                        로그인
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setOpen(false)}
                        className="flex items-center text-lg font-medium transition-colors hover:text-primary text-primary"
                      >
                        회원가입
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 