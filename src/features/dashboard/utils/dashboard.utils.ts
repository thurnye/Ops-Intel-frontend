import type {
  DashboardDirection,
  DashboardKpiCard,
  DashboardModuleCard,
  DashboardStatusTone,
} from "@features/dashboard/types/dashboard.types";

export function formatDashboardCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getDashboardTrendChipColor(direction: DashboardDirection): DashboardStatusTone {
  if (direction === "up") {
    return "success";
  }

  if (direction === "down") {
    return "error";
  }

  return "default";
}

export function getDashboardStatusChipColor(status: string): DashboardStatusTone {
  switch (status) {
    case "Completed":
    case "Healthy":
      return "success";
    case "In Progress":
    case "Pending":
    case "Low":
      return "warning";
    case "Delayed":
    case "Critical":
      return "error";
    default:
      return "default";
  }
}

export function getDashboardModuleStatusColor(
  status: DashboardModuleCard["status"],
): DashboardStatusTone {
  switch (status) {
    case "Healthy":
      return "success";
    case "Needs Review":
      return "warning";
    case "Critical":
      return "error";
    default:
      return "default";
  }
}

export function getDashboardAlertSeverityColor(severity: "Critical" | "Warning" | "Info"): DashboardStatusTone {
  switch (severity) {
    case "Critical":
      return "error";
    case "Warning":
      return "warning";
    case "Info":
      return "info";
    default:
      return "default";
  }
}

export function getKpiTrendChipColor(kpi: DashboardKpiCard) {
  return getDashboardTrendChipColor(kpi.direction);
}
