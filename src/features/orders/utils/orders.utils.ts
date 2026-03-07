import type { OrderStatus } from "@features/orders/types/orders.types";

export function statusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    new: "New",
    in_production: "In Production",
    delayed: "Delayed",
    ready_to_ship: "Ready to Ship",
    shipped: "Shipped"
  };

  return labels[status];
}
