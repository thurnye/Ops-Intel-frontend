import type { AnalyticsMetric } from "@features/analytics/types/analytics.types";

export function metricChangePercent(metric: AnalyticsMetric): string {
  if (metric.previous === 0) return "—";
  const change = ((metric.current - metric.previous) / metric.previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export function trendColor(trend: "up" | "down" | "flat"): "success" | "error" | "default" {
  if (trend === "up") return "success";
  if (trend === "down") return "error";
  return "default";
}
