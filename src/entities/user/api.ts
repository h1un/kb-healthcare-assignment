import { apiRequest } from "@/shared/api/http-client";
import type { UserResponse } from "@/shared/api/types";
import { userResponseSchema } from "@/shared/api/validators";

export function getUser() {
  return apiRequest<UserResponse>("/api/user", {
    responseSchema: userResponseSchema,
  });
}
