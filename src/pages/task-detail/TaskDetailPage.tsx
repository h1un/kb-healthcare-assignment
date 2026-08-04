import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDaysIcon, Trash2Icon } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

export function TaskDetailPage() {
  const taskId = useRouterState({ select: (state) => state.location.pathname.split("/").at(-1) ?? "" });

  return (
    <section className="flex flex-col gap-5">
      <Link to="/task" className="text-sm font-black text-muted-foreground">
        할 일 목록으로 돌아가기
      </Link>

      <article className="rounded-[2rem] bg-card p-7 shadow-[0_16px_40px_rgba(35,40,50,0.06)]">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="destructive">{taskId}</Badge>
          <Badge variant="secondary">해야할 일</Badge>
        </div>
        <h2 className="mt-6 text-3xl font-black leading-tight text-kb-ink">물 2L 마시기</h2>
        <p className="mt-4 text-base font-bold leading-relaxed text-muted-foreground">한 컵씩 나눠서 자주 마시기.</p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-black text-muted-foreground">
          <CalendarDaysIcon className="size-4" aria-hidden="true" />
          2026.08.05 등록
        </div>
      </article>

      <Button className="h-12 rounded-2xl font-black" variant="destructive">
        <Trash2Icon data-icon="inline-start" />
        삭제하기
      </Button>
    </section>
  );
}
