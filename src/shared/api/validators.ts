import { z } from "zod";
import type {
  AuthTokenResponse,
  DashboardResponse,
  DeleteTaskResponse,
  TaskDetailResponse,
  TaskItem,
  TaskListResponse,
  UserResponse,
} from "./types";

export const authTokenResponseSchema: z.ZodType<AuthTokenResponse> = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const userResponseSchema: z.ZodType<UserResponse> = z.object({
  name: z.string(),
  memo: z.string(),
});

export const dashboardResponseSchema: z.ZodType<DashboardResponse> = z.object({
  numOfTask: z.number().int().nonnegative(),
  numOfRestTask: z.number().int().nonnegative(),
  numOfDoneTask: z.number().int().nonnegative(),
});

export const taskItemSchema: z.ZodType<TaskItem> = z.object({
  id: z.string(),
  title: z.string(),
  memo: z.string(),
  status: z.enum(["TODO", "DONE"]),
});

export const taskListResponseSchema: z.ZodType<TaskListResponse> = z.object({
  data: z.array(taskItemSchema),
  hasNext: z.boolean(),
});

export const taskDetailResponseSchema: z.ZodType<TaskDetailResponse> = z.object({
  title: z.string(),
  memo: z.string(),
  registerDatetime: z.string().datetime(),
});

export const deleteTaskResponseSchema: z.ZodType<DeleteTaskResponse> = z.object({
  success: z.literal(true),
});
