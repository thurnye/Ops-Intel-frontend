import type { SalesOrder } from "@features/orders/types/orders.types";

export const ordersMock: SalesOrder[] = [
  {
    id: "SO-1024",
    customerName: "Northline EV Components",
    product: "Battery enclosure profile",
    quantity: 1200,
    dueDate: "2026-03-14",
    status: "in_production"
  },
  {
    id: "SO-1025",
    customerName: "Urban Build Systems",
    product: "Architectural frame section",
    quantity: 400,
    dueDate: "2026-03-10",
    status: "delayed"
  }
];
