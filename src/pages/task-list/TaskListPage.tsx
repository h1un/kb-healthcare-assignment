import { Link } from "@tanstack/react-router";
import { ChevronRightIcon, CheckIcon, CircleIcon } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

const previewTasks = [
  { id: "TASK-001", title: "아침 스트레칭 10분", memo: "오늘도 가볍게 몸을 깨워요.", status: "DONE" },
  { id: "TASK-002", title: "물 2L 마시기", memo: "한 컵씩 나눠서 자주 마시기.", status: "TODO" },
  { id: "TASK-003", title: "점심 후 산책하기", memo: "식후 15분 걷기만 해도 충분해요.", status: "TODO" },
  { id: "TASK-004", title: "영양제 챙겨 먹기", memo: "아침, 저녁으로 나눠서 복용.", status: "DONE" },
  { id: "TASK-005", title: "자외선 차단제 바르기", memo: "외출 30분 전에 미리 발라두기.", status: "TODO" },
  { id: "TASK-006", title: "실내 환기하기", memo: "막힌 공기를 정화해요.", status: "TODO" },
];

export function TaskListPage() {
  return (
    <section className="flex flex-col gap-5">
      <p className="text-sm font-black text-muted-foreground">
        전체 <span className="text-kb-ink">12</span>개의 할 일
      </p>
      {previewTasks.map((task) => (
        <Link
          key={task.id}
          to="/task/$taskId"
          params={{ taskId: task.id }}
          className="flex items-center gap-5 rounded-[2rem] bg-card p-6 shadow-[0_16px_40px_rgba(35,40,50,0.06)]"
        >
          <span
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-full",
              task.status === "DONE" ? "bg-kb-blue/15 text-kb-blue" : "bg-kb-pink text-destructive",
            )}
          >
            {task.status === "DONE" ? <CheckIcon aria-hidden="true" /> : <CircleIcon aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-black text-kb-ink">{task.title}</h2>
              <Badge variant={task.status === "DONE" ? "secondary" : "destructive"}>
                {task.status === "DONE" ? "완료" : "해야할 일"}
              </Badge>
            </div>
            <p className="mt-2 truncate text-base font-bold text-muted-foreground">{task.memo}</p>
          </div>
          <ChevronRightIcon className="size-6 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Link>
      ))}
    </section>
  );
}
