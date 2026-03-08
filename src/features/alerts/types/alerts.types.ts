export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertCategory = "inventory" | "orders" | "production" | "shipments" | "system";

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  source: string;
  createdAt: string;
  isRead: boolean;
  isResolved: boolean;
};

export type AlertsFilters = {
  severity: AlertSeverity | "";
  category: AlertCategory | "";
  showResolved: boolean;
};
