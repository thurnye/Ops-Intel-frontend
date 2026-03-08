export type AnalyticsMetric = {
  id: string;
  label: string;
  current: number;
  previous: number;
  unit: string;
  trend: "up" | "down" | "flat";
};

export type TrendPoint = { date: string; value: number };

export type AnalyticsCategory = "production" | "fulfillment" | "inventory";

export type AnalyticsDataset = {
  id: string;
  label: string;
  category: AnalyticsCategory;
  metrics: AnalyticsMetric[];
  trend: TrendPoint[];
};

export type AnalyticsFilters = {
  category: AnalyticsCategory | "";
  dateRange: "7d" | "30d" | "90d" | "1y";
};
