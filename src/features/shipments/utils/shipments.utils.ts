import type { ShipmentStatus } from "@features/shipments/types/shipments.types";

export function shipmentStatusLabel(status: ShipmentStatus): string {
  const map: Record<ShipmentStatus, string> = {
    pending: "Pending", packing: "Packing", dispatched: "Dispatched",
    in_transit: "In Transit", delivered: "Delivered", delayed: "Delayed"
  };
  return map[status];
}

export function shipmentStatusColor(status: ShipmentStatus): "default" | "info" | "primary" | "success" | "error" {
  const map: Record<ShipmentStatus, "default" | "info" | "primary" | "success" | "error"> = {
    pending: "default", packing: "info", dispatched: "primary",
    in_transit: "primary", delivered: "success", delayed: "error"
  };
  return map[status];
}
