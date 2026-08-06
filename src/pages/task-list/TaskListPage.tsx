import { useInfiniteQuery } from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Link } from "@tanstack/react-router";
import { ChevronRightIcon, CheckIcon, CircleIcon, ClipboardListIcon, RefreshCwIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { getTasks } from "@/entities/task/api";
import type { TaskItem } from "@/shared/api/types";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/ui/empty";
import { Skeleton } from "@/shared/ui/skeleton";

export default function TaskListPage() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isLoading,
    isLoadingError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["tasks"],
    queryFn: ({ pageParam }) => getTasks(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (lastPage.hasNext ? pages.length + 1 : undefined),
  });
  const tasks = data?.pages.flatMap((page) => page.data) ?? [];
  const rowCount = hasNextPage ? tasks.length + 1 : tasks.length;
  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => 132,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();
  const lastVirtualIndex = virtualItems.at(-1)?.index;

  useEffect(() => {
    if (lastVirtualIndex === undefined || !hasNextPage || isFetchNextPageError || isFetchingNextPage) {
      return;
    }

    if (lastVirtualIndex >= tasks.length - 1) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage, lastVirtualIndex, tasks.length]);

  if (isLoading) {
    return (
      <section className="flex flex-col gap-5" aria-busy="true">
        <p className="sr-only" role="status">
          할 일 목록을 불러오는 중입니다.
        </p>
        <Skeleton className="h-5 w-32 rounded-xl" />
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-29 rounded-card" />
        ))}
      </section>
    );
  }

  if (isLoadingError) {
    return (
      <Empty className="min-h-130 rounded-card bg-card" role="alert">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RefreshCwIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>할 일을 불러오지 못했어요</EmptyTitle>
          <EmptyDescription>잠시 후 다시 시도해주세요.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => void refetch()}>다시 불러오기</Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty className="min-h-130 rounded-card bg-card" role="status">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ClipboardListIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>등록된 할 일이 없어요</EmptyTitle>
          <EmptyDescription>대시보드에서 오늘의 리듬을 확인해보세요.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <section className="flex flex-col gap-5" aria-busy={isFetchingNextPage}>
      <p className="text-sm font-black text-muted-foreground" aria-live="polite" aria-atomic="true">
        불러온 <span className="text-kb-ink">{tasks.length}</span>개의 할 일
      </p>
      <div
        ref={listRef}
        role="list"
        aria-label="할 일 목록"
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualItem) => {
          const task = tasks[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              role="listitem"
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start - rowVirtualizer.options.scrollMargin}px)`,
              }}
            >
              {task ? (
                <TaskCard task={task} />
              ) : (
                <LoadMoreRow hasError={isFetchNextPageError} onRetry={() => void fetchNextPage()} />
              )}
            </div>
          );
        })}
      </div>
      {isFetchingNextPage ? (
        <p role="status" className="py-4 text-center text-sm font-bold text-muted-foreground">
          더 불러오는 중…
        </p>
      ) : null}
    </section>
  );
}

function LoadMoreRow({ hasError, onRetry }: { hasError: boolean; onRetry: () => void }) {
  if (hasError) {
    return (
      <div role="alert" className="flex h-29 items-center justify-center gap-3 rounded-card bg-card text-sm font-bold text-muted-foreground">
        다음 페이지를 불러오지 못했어요.
        <Button type="button" variant="outline" onClick={onRetry}>
          다시 불러오기
        </Button>
      </div>
    );
  }

  return (
    <div role="status">
      <span className="sr-only">다음 할 일을 불러오는 중입니다.</span>
      <Skeleton className="h-29 rounded-card" />
    </div>
  );
}

function TaskCard({ task }: { task: TaskItem }) {
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
