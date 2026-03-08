import type { ReportRow } from "@features/reports/types/reports.types";

export function changeColor(row: ReportRow): "success" | "error" | "default" {
  if (row.direction === "up") return "success";
  if (row.direction === "down") return "error";
  return "default";
}
