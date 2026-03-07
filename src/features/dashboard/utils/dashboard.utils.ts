import type { KpiCardData } from "@features/dashboard/types/dashboard.types";

export function kpiDeltaColor(kpi: KpiCardData): "success" | "error" | "default" {
  if (kpi.direction === "up") return "success";
  if (kpi.direction === "down") return "error";
  return "default";
}
