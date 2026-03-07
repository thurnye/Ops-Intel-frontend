import type { ActivityItem, AlertSummary, KpiCardData } from "@features/dashboard/types/dashboard.types";

export const dashboardKpis: KpiCardData[] = [
  { id: "k1", label: "Open Orders", value: "248", delta: "+12", direction: "up" },
  { id: "k2", label: "In Production", value: "67", delta: "+4", direction: "up" },
  { id: "k3", label: "Delayed Orders", value: "14", delta: "-3", direction: "down" },
  { id: "k4", label: "Utilization", value: "82%", delta: "+1.2%", direction: "up" }
];

export const dashboardAlerts: AlertSummary[] = [
  { id: "a1", title: "Low stock: ALU-6061-BAR", severity: "high" },
  { id: "a2", title: "Order SO-1123 delayed 2h", severity: "medium" }
];

export const dashboardActivity: ActivityItem[] = [
  { id: "e1", message: "Job WO-443 moved to quality check", happenedAt: "5m ago" },
  { id: "e2", message: "Shipment SH-220 marked dispatched", happenedAt: "16m ago" }
];
