import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { ApiError } from "@/shared/api/http-client";
import { getTaskDetail, getTasks } from "./api";

export const taskQueryKeys = {
  all: ["task"] as const,
  list: () => [...taskQueryKeys.all, "list"] as const,
  detail: (taskId: string) => [...taskQueryKeys.all, "detail", taskId] as const,
};

export const taskListQueryOptions = infiniteQueryOptions({
  queryKey: taskQueryKeys.list(),
  queryFn: ({ pageParam }) => getTasks(pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage, pages) => (lastPage.hasNext ? pages.length + 1 : undefined),
});

export function getTaskDetailQueryOptions(taskId: string) {
  return queryOptions({
    queryKey: taskQueryKeys.detail(taskId),
    queryFn: () => getTaskDetail(taskId),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }

      return failureCount < 1;
    },
  });
}
