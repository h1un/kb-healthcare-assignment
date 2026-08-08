import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeftIcon, CalendarDaysIcon, ListChecksIcon, RefreshCwIcon } from "lucide-react";
import { getTaskDetailQueryOptions } from "@/entities/task/queries";
import { DeleteTaskDialog } from "@/features/delete-task/DeleteTaskDialog";
import { ApiError } from "@/shared/api/http-client";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/ui/empty";
import { Skeleton } from "@/shared/ui/skeleton";

export default function TaskDetailPage() {
  const { taskId } = useParams({ from: "/app/task/$taskId" });
  const { data, error, isLoading, isLoadingError, refetch } = useQuery(getTaskDetailQueryOptions(taskId));

  const isNotFound = isLoadingError && error instanceof ApiError && error.status === 404;

  return (
    <section className="flex flex-col gap-5">
      {!isNotFound && (
        <Button className="-ml-2 w-fit rounded-full px-3 text-sm font-black text-muted-foreground" variant="ghost" asChild>
          <Link to="/task">
            <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
            할 일 목록으로 돌아가기
          </Link>
        </Button>
      )}

      {isLoading && <TaskDetailSkeleton />}

      {isNotFound && (
        <Empty className="min-h-115 rounded-card bg-card px-8 py-10 shadow-card" role="status">
          <EmptyHeader>
            <EmptyMedia className="mb-3 size-16 rounded-tile bg-kb-yellow-soft text-kb-ink" variant="icon">
              <ListChecksIcon className="size-8" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle className="text-2xl font-black text-kb-ink">할 일을 찾을 수 없어요</EmptyTitle>
            <EmptyDescription className="font-bold">이미 삭제됐거나 존재하지 않는 할 일입니다.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="max-w-70">
            <Button className="h-12 w-full rounded-2xl bg-kb-yellow text-base font-black text-kb-ink hover:bg-kb-yellow/90" asChild>
              <Link to="/task">목록으로 이동</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {isLoadingError && !isNotFound && (
        <Empty className="min-h-110 rounded-card bg-card" role="alert">
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
          <article className="rounded-card bg-card p-7 shadow-card">
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
    <article className="rounded-card bg-card p-7 shadow-card" aria-busy="true">
      <p className="sr-only" role="status">
        할 일 상세 정보를 불러오는 중입니다.
      </p>
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
