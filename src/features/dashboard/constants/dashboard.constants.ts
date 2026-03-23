export const DASHBOARD_ROUTE = "/dashboard";

import type { DashboardOverviewData } from "@features/dashboard/types/dashboard.types";

export const dashboardOverviewShell: DashboardOverviewData = {
  header: {
    title: "Dashboard",
    subtitle:
      "Monitor operations, finances, inventory, production, and shipment performance in one place.",
    rangeOptions: [
      { value: "7d", label: "Last 7 days" },
      { value: "30d", label: "Last 30 days" },
      { value: "90d", label: "Last 90 days" },
      { value: "1y", label: "Last 12 months" },
    ],
    siteOptions: [
      { value: "all", label: "All Sites" },
      { value: "toronto", label: "Toronto DC" },
      { value: "vaughan", label: "Vaughan Hub" },
      { value: "hamilton", label: "Hamilton Central" },
    ],
    refreshLabel: "Refresh",
    exportLabel: "Export",
  },
  analyticsHeader: {
    title: "Operational Analytics",
    subtitle: "Visual insights across inventory, production, shipment, and finance.",
  },
  kpis: [
    { id: "revenue", title: "Total Revenue", value: "—", change: "—", subtext: "vs last month", iconKey: "currency", color: "#2563eb", direction: "flat" },
    { id: "orders", title: "Orders in Progress", value: "—", change: "—", subtext: "current workload", iconKey: "orders", color: "#7c3aed", direction: "flat" },
    { id: "production", title: "Production Efficiency", value: "—", change: "—", subtext: "this period", iconKey: "production", color: "#f59e0b", direction: "flat" },
    { id: "inventory", title: "Inventory Value", value: "—", change: "—", subtext: "network stock value", iconKey: "inventory", color: "#14b8a6", direction: "flat" },
    { id: "shipments", title: "Shipments Pending", value: "—", change: "—", subtext: "current queue", iconKey: "shipments", color: "#ef4444", direction: "flat" },
    { id: "alerts", title: "Critical Alerts", value: "—", change: "—", subtext: "needs review", iconKey: "alerts", color: "#f97316", direction: "flat" },
  ],
  businessPerformance: {
    title: "Business Performance Overview",
    metricChips: ["Revenue", "Orders", "Shipments"],
    revenueTrendTitle: "Monthly Revenue Trend",
    revenueTrend: {
      labels: [],
      series: [{ label: "Revenue (CAD '000)", data: [] }],
    },
    progressCards: [
      { id: "on-time", title: "On-Time Shipment Rate", value: "—", progress: 0, color: "primary" },
      { id: "capacity", title: "Warehouse Capacity Use", value: "—", progress: 0, color: "warning" },
      { id: "approvals", title: "Approval Queue", value: "—", progress: 0, description: "Pending approval workload.", color: "info" },
    ],
  },
  attentionRequired: {
    title: "Attention Required",
    alerts: [],
    quickActionsTitle: "Quick Actions",
    quickActions: [
      { id: "create-order", label: "Create Order", iconKey: "task", variant: "contained" },
      { id: "new-po", label: "New PO", iconKey: "shopping", variant: "outlined" },
      { id: "add-inventory", label: "Add Inventory", iconKey: "warehouse", variant: "outlined" },
      { id: "schedule-shipment", label: "Schedule Shipment", iconKey: "shipments", variant: "outlined" },
    ],
  },
  finance: {
    sectionTitle: "Finance Analytics",
    revenueExpenseTitle: "Revenue vs Expense Trend",
    expenseBreakdownTitle: "Expense Breakdown",
    revenueExpenseTrend: { labels: [], series: [{ label: "Revenue", data: [] }, { label: "Expenses", data: [] }, { label: "Net Cashflow", data: [] }] },
    expenseBreakdown: [],
  },
  moduleHealth: { cards: [] },
  inventory: {
    sectionTitle: "Inventory Analytics",
    lowStockTitle: "Top Low-Stock Items",
    lowStockChart: { labels: [], series: [{ label: "Available Units", data: [] }], layout: "horizontal" },
    inflowOutflowTitle: "Inventory Inflow vs Outflow",
    inflowOutflowChart: { labels: [], series: [{ label: "Inflow", data: [] }, { label: "Outflow", data: [] }] },
    warehouseCompositionTitle: "Warehouse Stock Composition",
    warehouseCompositionChart: { labels: [], series: [{ label: "Raw Materials", data: [], stack: "stock" }, { label: "Finished Goods", data: [], stack: "stock" }, { label: "Packaging", data: [], stack: "stock" }] },
    inventoryMixTitle: "Inventory Mix by Category",
    inventoryMix: [],
  },
  production: {
    sectionTitle: "Production Analytics",
    efficiencyTitle: "Production Line Efficiency Comparison",
    efficiencyChart: { labels: [], series: [] },
    statusMixTitle: "Production Job Status Mix",
    statusMix: [],
    plannedVsActualTitle: "Planned vs Actual Production Output",
    plannedVsActualChart: { labels: [], series: [{ label: "Planned Output", data: [] }, { label: "Actual Output", data: [] }] },
  },
  shipments: {
    sectionTitle: "Shipment Analytics",
    onTimeVsDelayedTitle: "On-Time vs Delayed Shipment Trend",
    onTimeVsDelayedChart: { labels: [], series: [{ label: "On-Time %", data: [] }, { label: "Delayed %", data: [] }] },
    statusDistributionTitle: "Shipment Status Distribution",
    statusDistribution: [],
    weeklyOrdersVsShipmentsTitle: "Weekly Orders vs Shipments",
    weeklyOrdersVsShipmentsChart: { labels: [], series: [{ label: "Orders", data: [] }, { label: "Shipments", data: [] }] },
    teamTaskCompletionTitle: "Team Task Completion",
    teamTaskCompletion: [],
    inventoryMixTitle: "Inventory Mix",
    inventoryMix: [],
  },
  summarySnapshots: [
    { id: "workforce", title: "Workforce Snapshot", iconKey: "groups", accentTone: "info", primaryLabel: "Active Staff", primaryValue: "—", stats: [{ label: "Shift coverage", value: "—" }, { label: "Open positions", value: "—" }] },
    { id: "procurement", title: "Procurement Summary", iconKey: "shopping", accentTone: "warning", primaryLabel: "Open Purchase Orders", primaryValue: "—", stats: [{ label: "Awaiting approval", value: "—" }, { label: "Supplier SLA met", value: "—" }] },
    { id: "warehouse", title: "Warehouse Summary", iconKey: "warehouse", accentTone: "success", primaryLabel: "Warehouses Active", primaryValue: "—", stats: [{ label: "Avg. pick accuracy", value: "—" }, { label: "Cross-dock utilization", value: "—" }] },
  ],
  workflow: { title: "Workflow Pipeline", steps: [] },
  activityFeed: {
    title: "Live Activity Feed",
    items: [],
    insight: {
      title: "AI Insight",
      message: "Insights will appear here when live dashboard data is loaded.",
      iconKey: "task",
    },
  },
  tables: {
    recentOrdersTitle: "Recent Orders",
    lowStockItemsTitle: "Low Stock Items",
    recentOrders: [],
    lowStockItems: [],
  },
};
