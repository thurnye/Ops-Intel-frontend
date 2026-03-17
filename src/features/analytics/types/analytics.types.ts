import type {
  DashboardBarChartData,
  DashboardDirection,
  DashboardIconKey,
  DashboardLineChartData,
  DashboardPieDatum,
  DashboardSelectOption,
  DashboardStatusTone,
} from "@features/dashboard/types/dashboard.types";

export type AnalyticsCategory = "production" | "fulfillment" | "inventory";

export type AnalyticsFilters = {
  category: AnalyticsCategory | "";
  dateRange: "7d" | "30d" | "90d" | "1y";
  plant: string;
};

export type AnalyticsKpi = {
  id: string;
  title: string;
  value: string;
  change: string;
  helper: string;
  positive: boolean;
  iconKey: DashboardIconKey;
};

export type AnalyticsMetricProgress = {
  id: string;
  label: string;
  value: string;
  progress: number;
  iconKey: DashboardIconKey;
};

export type AnalyticsAlert = {
  id: string;
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
};

export type AnalyticsInsightCard = {
  id: string;
  iconKey: DashboardIconKey;
  title: string;
  body: string;
};

export type AnalyticsOverviewData = {
  header: {
    title: string;
    subtitle: string;
    dateRangeOptions: DashboardSelectOption[];
    plantOptions: DashboardSelectOption[];
    exportLabel: string;
  };
  kpis: AnalyticsKpi[];
  operationalTrend: {
    title: string;
    subtitle: string;
    chart: DashboardLineChartData;
  };
  fulfillmentMix: {
    title: string;
    subtitle: string;
    data: DashboardPieDatum[];
    colors: string[];
  };
  throughput: {
    title: string;
    subtitle: string;
    chart: DashboardBarChartData;
  };
  shipmentPerformance: {
    title: string;
    subtitle: string;
    chart: DashboardBarChartData;
  };
  qualityTrend: {
    title: string;
    subtitle: string;
    chart: DashboardLineChartData;
  };
  operationalHealth: {
    title: string;
    subtitle: string;
    metrics: AnalyticsMetricProgress[];
  };
  alerts: {
    title: string;
    subtitle: string;
    items: AnalyticsAlert[];
  };
  insightSummary: {
    title: string;
    subtitle: string;
    cards: AnalyticsInsightCard[];
  };
};

export type AnalyticsState = {
  overview: AnalyticsOverviewData;
  filters: AnalyticsFilters;
  loading: boolean;
};

export function getAnalyticsAlertTone(severity: AnalyticsAlert["severity"]): DashboardStatusTone {
  switch (severity) {
    case "High":
      return "error";
    case "Medium":
      return "warning";
    case "Low":
      return "success";
    default:
      return "default";
  }
}
