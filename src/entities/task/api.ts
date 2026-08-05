import { apiRequest } from "@/shared/api/http-client";
import type { DeleteTaskResponse, TaskDetailResponse, TaskListResponse } from "@/shared/api/types";
import { deleteTaskResponseSchema, taskDetailResponseSchema, taskListResponseSchema } from "@/shared/api/validators";

export function getTasks(page: number) {
  return apiRequest<TaskListResponse>(`/api/task?page=${page}`, {
    responseSchema: taskListResponseSchema,
  });
}

export function getTaskDetail(id: string) {
  return apiRequest<TaskDetailResponse>(`/api/task/${id}`, {
    responseSchema: taskDetailResponseSchema,
  });
}

export function deleteTask(id: string) {
  return apiRequest<DeleteTaskResponse>(`/api/task/${id}`, {
    method: "DELETE",
    responseSchema: deleteTaskResponseSchema,
  });
}
