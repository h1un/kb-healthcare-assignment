import { Link } from "@tanstack/react-router";
import { ChevronRightIcon, CheckIcon, CircleIcon } from "lucide-react";
import type { TaskItem } from "@/shared/api/types";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";

type TaskCardProps = {
  task: TaskItem;
};

export function TaskCard({ task }: TaskCardProps) {
  const isDone = task.status === "DONE";

  return (
    <Link
      to="/task/$taskId"
      params={{ taskId: task.id }}
      className="flex h-29 items-center gap-3 rounded-card bg-card p-4 shadow-card transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring motion-reduce:transform-none xs:gap-5 xs:p-6"
    >
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-full xs:size-12",
          isDone ? "bg-kb-blue/15 text-kb-blue" : "bg-kb-pink text-destructive",
        )}
      >
        {isDone ? <CheckIcon aria-hidden="true" /> : <CircleIcon aria-hidden="true" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-lg font-black text-kb-ink xs:text-xl">
            <span className="sr-only">{task.id} </span>
            {task.title}
          </h2>
          <Badge variant={isDone ? "secondary" : "destructive"}>{isDone ? "완료" : "해야 할 일"}</Badge>
        </div>
        <p className="mt-2 truncate text-sm font-bold text-muted-foreground xs:text-base">{task.memo}</p>
      </div>
      <ChevronRightIcon className="size-6 shrink-0 text-muted-foreground" aria-hidden="true" />
    </Link>
  );
}
