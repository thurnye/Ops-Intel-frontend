export type ReportType = "production" | "orders" | "inventory" | "shipments";

export type ReportRow = {
  id: string;
  label: string;
  value: string;
  change: string;
  direction: "up" | "down" | "flat";
};

export type ReportData = {
  type: ReportType;
  title: string;
  generatedAt: string;
  rows: ReportRow[];
};

export type ReportsFilters = {
  type: ReportType | "";
  dateRange: "today" | "week" | "month" | "quarter";
};
