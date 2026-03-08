import type { WorkOrder, WorkOrderStatus } from "@features/production/types/production.types";

export function countBlockedOrders(workOrders: WorkOrder[]): number {
  return workOrders.filter((o) => o.status === "blocked").length;
}

export function statusLabel(status: WorkOrderStatus): string {
  const map: Record<WorkOrderStatus, string> = {
    scheduled: "Scheduled",
    in_progress: "In Progress",
    completed: "Completed",
    blocked: "Blocked"
  };
  return map[status];
}

export function statusColor(status: WorkOrderStatus): "default" | "primary" | "success" | "error" {
  const map: Record<WorkOrderStatus, "default" | "primary" | "success" | "error"> = {
    scheduled: "default",
    in_progress: "primary",
    completed: "success",
    blocked: "error"
  };
  return map[status];
}
