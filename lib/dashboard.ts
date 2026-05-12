import type { DashboardSummary } from "@/types";
import { apiFetch } from "./api";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>("/dashboard/summary");
}
