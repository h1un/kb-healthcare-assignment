import type { components } from "./schema";

export type SignInRequest = components["schemas"]["SignInRequest"];
export type AuthTokenResponse = components["schemas"]["AuthTokenResponse"];
export type ErrorResponse = components["schemas"]["ErrorResponse"];
export type DashboardResponse = components["schemas"]["DashboardResponse"];
export type UserResponse = components["schemas"]["UserResponse"];
export type TaskItem = components["schemas"]["TaskItem"];
export type TaskStatus = TaskItem["status"];
export type TaskListResponse = components["schemas"]["TaskListResponse"];
export type TaskDetailResponse = components["schemas"]["TaskDetailResponse"];
export type DeleteTaskResponse = components["schemas"]["DeleteTaskResponse"];
