"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  const routes = [
    { href: "/", label: "홈", icon: Home },
    { href: "/board", label: "게시판", icon: Users },
    { href: "/settings", label: "설정", icon: Settings },
  ];
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 