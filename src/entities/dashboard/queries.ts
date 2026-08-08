import { queryOptions } from "@tanstack/react-query";
import { getDashboard } from "./api";

export const dashboardQueryKey = ["dashboard"] as const;

export const dashboardQueryOptions = queryOptions({
  queryKey: dashboardQueryKey,
  queryFn: getDashboard,
});
