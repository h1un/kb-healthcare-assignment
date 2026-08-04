import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDaysIcon, RefreshCwIcon } from "lucide-react";
import { getTaskDetail } from "@/entities/task/api";
import { DeleteTaskDialog } from "@/features/delete-task/DeleteTaskDialog";
import { ApiError } from "@/shared/api/http-client";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/ui/empty";
import { Skeleton } from "@/shared/ui/skeleton";

export function TaskDetailPage() {
  const taskId = useRouterState({ select: (state) => state.location.pathname.split("/").at(-1) ?? "" });
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskDetail(taskId),
    retry: (failureCount, queryError) => {
      if (queryError instanceof ApiError && queryError.status === 404) {
        return false;
      }

      return failureCount < 1;
    },
  });

  const isNotFound = error instanceof ApiError && error.status === 404;

  return (
    <section className="flex flex-col gap-5">
      <Link to="/task" className="text-sm font-black text-muted-foreground">
        할 일 목록으로 돌아가기
      </Link>

      {isLoading && <TaskDetailSkeleton />}

      {isNotFound && (
        <Empty className="min-h-[440px] rounded-[2rem] bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <RefreshCwIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>할 일을 찾을 수 없어요</EmptyTitle>
            <EmptyDescription>이미 삭제됐거나 존재하지 않는 할 일입니다.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to="/task">목록으로 이동</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {isError && !isNotFound && (
        <Empty className="min-h-[440px] rounded-[2rem] bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <RefreshCwIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>상세 정보를 불러오지 못했어요</EmptyTitle>
            <EmptyDescription>잠시 후 다시 시도해주세요.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => void refetch()}>다시 불러오기</Button>
          </EmptyContent>
        </Empty>
      )}

      {data && (
        <>
          <article className="rounded-[2rem] bg-card p-7 shadow-[0_16px_40px_rgba(35,40,50,0.06)]">
            <Badge variant="destructive">{taskId}</Badge>
            <h2 className="mt-6 text-3xl font-black leading-tight text-kb-ink">{data.title}</h2>
            <p className="mt-4 text-base font-bold leading-relaxed text-muted-foreground">{data.memo}</p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-black text-muted-foreground">
              <CalendarDaysIcon className="size-4" aria-hidden="true" />
              {formatDate(data.registerDatetime)} 등록
            </div>
          </article>

          <DeleteTaskDialog taskId={taskId} />
        </>
      )}
    </section>
  );
}

function TaskDetailSkeleton() {
  return (
    <article className="rounded-[2rem] bg-card p-7 shadow-[0_16px_40px_rgba(35,40,50,0.06)]">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="mt-6 h-10 w-3/4 rounded-2xl" />
      <Skeleton className="mt-4 h-6 w-full rounded-xl" />
      <Skeleton className="mt-2 h-6 w-2/3 rounded-xl" />
      <Skeleton className="mt-8 h-9 w-40 rounded-full" />
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(value))
    .replaceAll(". ", ".")
    .replace(/\.$/, "");
}
