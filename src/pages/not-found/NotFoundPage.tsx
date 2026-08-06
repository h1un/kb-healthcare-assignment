import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "@/shared/ui/empty";

export function NotFoundPage() {
  useEffect(() => {
    document.title = "페이지를 찾을 수 없음 | KB O'CARE";
  }, []);

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6">
      <Empty className="max-w-105 rounded-card bg-card p-8 shadow-panel">
        <EmptyHeader>
          <h1 className="font-heading text-xl font-black tracking-tight text-kb-ink">페이지를 찾을 수 없습니다</h1>
          <EmptyDescription>요청한 경로가 존재하지 않습니다.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/">대시보드로 이동</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
