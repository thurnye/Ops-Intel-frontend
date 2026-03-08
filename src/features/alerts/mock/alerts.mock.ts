import type { Alert } from "@features/alerts/types/alerts.types";

export const alertsMock: Alert[] = [
  { id: "ALT-001", title: "Low stock: ALU-6061-BAR", description: "Quantity on hand (88) is below reorder point (120). Restock immediately.", severity: "critical", category: "inventory", source: "Inventory Monitor", createdAt: "2026-03-07T06:30:00Z", isRead: false, isResolved: false },
  { id: "ALT-002", title: "Order SO-1025 delayed", description: "Order is 2 hours past expected production completion. Blocked on Northgate-1.", severity: "high", category: "orders", source: "Order Tracker", createdAt: "2026-03-07T08:15:00Z", isRead: false, isResolved: false },
  { id: "ALT-003", title: "Production line Northgate-1 blocked", description: "Work order WO-1244 is blocked due to material shortage.", severity: "high", category: "production", source: "Production Monitor", createdAt: "2026-03-07T07:00:00Z", isRead: true, isResolved: false },
  { id: "ALT-004", title: "Shipment SH-224 delayed", description: "Carrier reports delay due to weather conditions. New ETA pending.", severity: "medium", category: "shipments", source: "Shipping Tracker", createdAt: "2026-03-06T16:00:00Z", isRead: true, isResolved: false },
  { id: "ALT-005", title: "Scheduling conflict on Northgate-1", description: "Two jobs overlap on March 8 for Northgate-1 line.", severity: "medium", category: "production", source: "Schedule Validator", createdAt: "2026-03-06T14:00:00Z", isRead: false, isResolved: false },
  { id: "ALT-006", title: "API sync warning", description: "ERP data sync completed with 3 warnings. Review import log.", severity: "low", category: "system", source: "System", createdAt: "2026-03-06T12:00:00Z", isRead: true, isResolved: true }
];
