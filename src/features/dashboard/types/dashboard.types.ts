export type DashboardDirection = "up" | "down" | "flat";

export type DashboardIconKey =
  | "currency"
  | "orders"
  | "inventory"
  | "shipments"
  | "alerts"
  | "production"
  | "shopping"
  | "warehouse"
  | "groups"
  | "check"
  | "trend"
  | "task"
  | "notifications";

export type DashboardStatusTone = "success" | "warning" | "error" | "info" | "default";

export type DashboardSelectOption = {
  value: string;
  label: string;
};

export type DashboardKpiCard = {
  id: string;
  title: string;
  value: string;
  change: string;
  subtext: string;
  iconKey: DashboardIconKey;
  color: string;
  direction: DashboardDirection;
};

export type DashboardAlert = {
  id: number;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
};

export type DashboardActivityItem = {
  id: number;
  text: string;
  time: string;
  color: string;
};

export type DashboardQuickAction = {
  id: string;
  label: string;
  iconKey: DashboardIconKey;
  variant: "contained" | "outlined";
};

export type DashboardModuleCard = {
  id: string;
  title: string;
  value: string;
  status: "Healthy" | "Needs Review" | "Critical";
  note: string;
  iconKey: DashboardIconKey;
  color: string;
};

export type DashboardProgressCard = {
  id: string;
  title: string;
  value: string;
  progress: number;
  description?: string;
  color?: "primary" | "warning" | "success" | "info";
};

export type DashboardLineSeries = {
  label: string;
  data: number[];
};

export type DashboardLineChartData = {
  labels: string[];
  series: DashboardLineSeries[];
};

export type DashboardBarSeries = {
  label: string;
  data: number[];
  stack?: string;
};

export type DashboardBarChartData = {
  labels: string[];
  series: DashboardBarSeries[];
  layout?: "horizontal" | "vertical";
};

export type DashboardPieDatum = {
  id: number;
  value: number;
  label: string;
};

export type DashboardPipelineStep = {
  label: string;
  count: number;
  progress: number;
  color: string;
};

export type DashboardTaskProgress = {
  label: string;
  value: number;
};

export type DashboardSnapshotStat = {
  label: string;
  value: string;
};

export type DashboardSnapshotCard = {
  id: string;
  title: string;
  iconKey: DashboardIconKey;
  accentTone: DashboardStatusTone;
  primaryLabel: string;
  primaryValue: string;
  stats: DashboardSnapshotStat[];
};

export type DashboardInsight = {
  title: string;
  message: string;
  iconKey: DashboardIconKey;
};

export type DashboardOrderRow = {
  orderNo: string;
  customer: string;
  module: string;
  amount: number;
  status: "Completed" | "In Progress" | "Pending" | "Delayed";
  dueDate: string;
  warehouse: string;
};

export type DashboardStockRow = {
  sku: string;
  item: string;
  warehouse: string;
  stock: number;
  reorderLevel: number;
  status: "Healthy" | "Low" | "Critical";
};

export type DashboardOverviewData = {
  header: {
    title: string;
    subtitle: string;
    rangeOptions: DashboardSelectOption[];
    siteOptions: DashboardSelectOption[];
    refreshLabel: string;
    exportLabel: string;
  };
  analyticsHeader: {
    title: string;
    subtitle: string;
  };
  kpis: DashboardKpiCard[];
  businessPerformance: {
    title: string;
    metricChips: string[];
    revenueTrendTitle: string;
    revenueTrend: DashboardLineChartData;
    progressCards: DashboardProgressCard[];
  };
  attentionRequired: {
    title: string;
    alerts: DashboardAlert[];
    quickActionsTitle: string;
    quickActions: DashboardQuickAction[];
  };
  finance: {
    sectionTitle: string;
    revenueExpenseTitle: string;
    expenseBreakdownTitle: string;
    revenueExpenseTrend: DashboardLineChartData;
    expenseBreakdown: DashboardPieDatum[];
  };
  moduleHealth: {
    cards: DashboardModuleCard[];
  };
  inventory: {
    sectionTitle: string;
    lowStockTitle: string;
    lowStockChart: DashboardBarChartData;
    inflowOutflowTitle: string;
    inflowOutflowChart: DashboardLineChartData;
    warehouseCompositionTitle: string;
    warehouseCompositionChart: DashboardBarChartData;
    inventoryMixTitle: string;
    inventoryMix: DashboardPieDatum[];
  };
  production: {
    sectionTitle: string;
    efficiencyTitle: string;
    efficiencyChart: DashboardLineChartData;
    statusMixTitle: string;
    statusMix: DashboardPieDatum[];
    plannedVsActualTitle: string;
    plannedVsActualChart: DashboardBarChartData;
  };
  shipments: {
    sectionTitle: string;
    onTimeVsDelayedTitle: string;
    onTimeVsDelayedChart: DashboardLineChartData;
    statusDistributionTitle: string;
    statusDistribution: DashboardPieDatum[];
    weeklyOrdersVsShipmentsTitle: string;
    weeklyOrdersVsShipmentsChart: DashboardBarChartData;
    teamTaskCompletionTitle: string;
    teamTaskCompletion: DashboardTaskProgress[];
    inventoryMixTitle: string;
    inventoryMix: DashboardPieDatum[];
  };
  summarySnapshots: DashboardSnapshotCard[];
  workflow: {
    title: string;
    steps: DashboardPipelineStep[];
  };
  activityFeed: {
    title: string;
    items: DashboardActivityItem[];
    insight: DashboardInsight;
  };
  tables: {
    recentOrdersTitle: string;
    lowStockItemsTitle: string;
    recentOrders: DashboardOrderRow[];
    lowStockItems: DashboardStockRow[];
  };
};

export type DashboardOverviewApiResponse = DashboardOverviewData;
