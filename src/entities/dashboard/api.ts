import { apiRequest } from "@/shared/api/http-client";
import type { DashboardResponse } from "@/shared/api/types";
import { dashboardResponseSchema } from "@/shared/api/validators";

export function getDashboard() {
  return apiRequest<DashboardResponse>("/api/dashboard", {
    responseSchema: dashboardResponseSchema,
  });
}
