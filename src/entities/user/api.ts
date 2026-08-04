import { apiRequest } from "@/shared/api/http-client";
import type { UserResponse } from "@/shared/api/types";

export function getUser() {
  return apiRequest<UserResponse>("/api/user");
}
