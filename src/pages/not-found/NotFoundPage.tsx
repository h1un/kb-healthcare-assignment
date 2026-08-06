import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/shared/ui/empty";

export function NotFoundPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6">
      <Empty className="max-w-105 rounded-card bg-card p-8 shadow-panel">
        <EmptyHeader>
          <EmptyTitle>페이지를 찾을 수 없습니다</EmptyTitle>
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
