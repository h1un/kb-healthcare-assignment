import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui/button";

export function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 py-10">
      <section className="w-full max-w-[420px] rounded-[2rem] bg-card p-8 shadow-[0_24px_60px_rgba(35,40,50,0.08)]">
        <p className="text-sm font-black text-kb-gray">KB Healthcare</p>
        <h1 className="mt-3 text-3xl font-black text-kb-ink">로그인</h1>
        <p className="mt-3 text-sm font-bold text-muted-foreground">로그인 폼은 API 연동 단계에서 연결합니다.</p>
        <Button className="mt-8 w-full" asChild>
          <Link to="/">대시보드로 돌아가기</Link>
        </Button>
      </section>
    </main>
  );
}
