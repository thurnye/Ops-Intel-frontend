import type { WorkOrder } from "@features/production/types/production.types";

export function countBlockedOrders(workOrders: WorkOrder[]): number {
  return workOrders.filter((order) => order.status === "blocked").length;
}
