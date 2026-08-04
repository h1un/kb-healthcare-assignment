import { apiRequest } from "@/shared/api/http-client";
import type { DashboardResponse } from "@/shared/api/types";

export function getDashboard() {
  return apiRequest<DashboardResponse>("/api/dashboard");
}
