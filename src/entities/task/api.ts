import { apiRequest } from "@/shared/api/http-client";
import type { DeleteTaskResponse, TaskDetailResponse, TaskListResponse } from "@/shared/api/types";

export function getTasks(page: number) {
  return apiRequest<TaskListResponse>(`/api/task?page=${page}`);
}

export function getTaskDetail(id: string) {
  return apiRequest<TaskDetailResponse>(`/api/task/${id}`);
}

export function deleteTask(id: string) {
  return apiRequest<DeleteTaskResponse>(`/api/task/${id}`, {
    method: "DELETE",
  });
}
