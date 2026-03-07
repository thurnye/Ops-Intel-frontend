export type KpiCardData = {
  id: string;
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down" | "flat";
};

export type AlertSummary = {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
};

export type ActivityItem = {
  id: string;
  message: string;
  happenedAt: string;
};
