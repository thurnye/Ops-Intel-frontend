import type { AnalyticsOverviewData } from "@features/analytics/types/analytics.types";

export const analyticsOverviewMock: AnalyticsOverviewData = {
  header: {
    title: "Operations Analytics",
    subtitle:
      "Deeper KPI and trend exploration across inventory, orders, production, quality, and shipment performance.",
    dateRangeOptions: [
      { value: "7d", label: "7D" },
      { value: "30d", label: "30D" },
      { value: "90d", label: "90D" },
      { value: "1y", label: "1Y" },
    ],
    plantOptions: [
      { value: "All Plants", label: "All Plants" },
      { value: "Toronto", label: "Toronto" },
      { value: "Calgary", label: "Calgary" },
      { value: "Vancouver", label: "Vancouver" },
      { value: "Montreal", label: "Montreal" },
    ],
    exportLabel: "Export",
  },
  kpis: [
    {
      id: "revenue",
      title: "Revenue",
      value: "$186,900",
      change: "+8.6%",
      helper: "vs prior period",
      positive: true,
      iconKey: "currency",
    },
    {
      id: "oee",
      title: "Overall OEE",
      value: "91.8%",
      change: "+2.3%",
      helper: "equipment effectiveness",
      positive: true,
      iconKey: "production",
    },
    {
      id: "fulfillment",
      title: "Fulfillment Rate",
      value: "94.2%",
      change: "+1.8%",
      helper: "on-time completion",
      positive: true,
      iconKey: "task",
    },
    {
      id: "defectRate",
      title: "Defect Rate",
      value: "1.9%",
      change: "-0.7%",
      helper: "quality improvement",
      positive: true,
      iconKey: "check",
    },
  ],
  operationalTrend: {
    title: "Operational Trend",
    subtitle: "Orders, production, shipments, and OEE trend in one view",
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      series: [
        { label: "Orders", data: [420, 460, 510, 495, 550, 590, 610, 640] },
        { label: "Production", data: [390, 415, 470, 458, 502, 544, 561, 592] },
        { label: "Shipments", data: [365, 388, 442, 436, 481, 521, 538, 566] },
        { label: "OEE %", data: [87.2, 88.1, 89.4, 88.8, 90.3, 91.2, 91.5, 91.8] },
      ],
    },
  },
  fulfillmentMix: {
    title: "Fulfillment Mix",
    subtitle: "Completion status distribution",
    data: [
      { id: 0, value: 78, label: "On Time" },
      { id: 1, value: 14, label: "Delayed" },
      { id: 2, value: 8, label: "Backordered" },
    ],
    colors: ["#16a34a", "#f59e0b", "#dc2626"],
  },
  throughput: {
    title: "Throughput vs Target",
    subtitle: "Line-level productivity against benchmark",
    chart: {
      labels: ["Line A", "Line B", "Line C", "Line D", "Line E"],
      series: [
        { label: "Actual", data: [94, 88, 102, 97, 91] },
        { label: "Target", data: [100, 100, 100, 100, 100] },
      ],
    },
  },
  shipmentPerformance: {
    title: "Shipment Performance by Region",
    subtitle: "Delivered vs delayed shipments",
    chart: {
      labels: ["Ontario", "Alberta", "BC", "Quebec"],
      series: [
        { label: "Delivered", data: [182, 149, 121, 136] },
        { label: "Delayed", data: [18, 14, 12, 16] },
      ],
    },
  },
  qualityTrend: {
    title: "Quality Trend",
    subtitle: "Pass rate and defect trend",
    chart: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
      series: [
        { label: "Pass Rate", data: [96.1, 96.8, 97.3, 96.9, 97.8, 98.1] },
        { label: "Defects", data: [21, 18, 15, 17, 12, 10] },
      ],
    },
  },
  operationalHealth: {
    title: "Operational Health",
    subtitle: "Supporting indicators across operations",
    metrics: [
      { id: "turnover", label: "Inventory Turnover", value: "7.4x", progress: 74, iconKey: "inventory" },
      { id: "leadTime", label: "Average Lead Time", value: "4.6 days", progress: 63, iconKey: "trend" },
      { id: "downtime", label: "Downtime", value: "3.4%", progress: 34, iconKey: "production" },
      { id: "throughput", label: "Network Throughput", value: "5,620 units", progress: 82, iconKey: "shipments" },
    ],
  },
  alerts: {
    title: "Alerts & Exceptions",
    subtitle: "Signals that need operational attention",
    items: [
      {
        id: "line-b",
        title: "Line B throughput below target",
        description: "Actual output is 12% below target over the selected range.",
        severity: "High",
      },
      {
        id: "packaging",
        title: "Packaging stock pressure",
        description: "Inventory coverage is trending down and may affect shipment readiness.",
        severity: "Medium",
      },
      {
        id: "ontario-sla",
        title: "Ontario delivery SLA improved",
        description: "On-time shipment recovery seen after route balancing.",
        severity: "Low",
      },
    ],
  },
  insightSummary: {
    title: "Insight Summary",
    subtitle: "Quick interpretation of the current operational direction",
    cards: [
      {
        id: "demand-alignment",
        iconKey: "trend",
        title: "Demand and execution are moving together",
        body:
          "Orders, production, and shipments are all trending upward with no major divergence yet, which suggests stable operational scaling.",
      },
      {
        id: "line-b-bottleneck",
        iconKey: "production",
        title: "Line B is the clearest bottleneck",
        body:
          "Compared with the target benchmark, Line B remains the most underperforming area and should be prioritized for investigation.",
      },
      {
        id: "quality-improving",
        iconKey: "check",
        title: "Quality is improving while volume grows",
        body:
          "Pass rate is increasing and defects are dropping, indicating process maturity rather than growth-driven quality erosion.",
      },
    ],
  },
};
