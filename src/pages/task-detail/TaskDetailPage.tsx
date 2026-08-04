import { Button } from "@/shared/ui/button";

export function TaskDetailPage() {
  return (
    <section className="rounded-[2rem] bg-card p-7 shadow-[0_16px_40px_rgba(35,40,50,0.06)]">
      <p className="text-sm font-black text-muted-foreground">Task Detail</p>
      <h2 className="mt-3 text-2xl font-black text-kb-ink">할 일 상세</h2>
      <p className="mt-3 text-sm font-bold text-muted-foreground">상세 조회와 삭제 확인은 API 연동 단계에서 구현합니다.</p>
      <Button className="mt-8" variant="destructive">
        삭제
      </Button>
    </section>
  );
}
