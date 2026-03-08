import type { AnalyticsDataset } from "@features/analytics/types/analytics.types";

export const analyticsMock: AnalyticsDataset[] = [
  {
    id: "prod-analytics", label: "Production Analytics", category: "production",
    metrics: [
      { id: "m1", label: "Throughput", current: 142, previous: 128, unit: "units/day", trend: "up" },
      { id: "m2", label: "Avg Cycle Time", current: 4.2, previous: 4.8, unit: "days", trend: "down" },
      { id: "m3", label: "Line Utilization", current: 82, previous: 79, unit: "%", trend: "up" },
      { id: "m4", label: "Downtime", current: 6.5, previous: 8.2, unit: "hrs/week", trend: "down" }
    ],
    trend: [
      { date: "2026-03-01", value: 120 }, { date: "2026-03-02", value: 135 }, { date: "2026-03-03", value: 128 },
      { date: "2026-03-04", value: 142 }, { date: "2026-03-05", value: 138 }, { date: "2026-03-06", value: 150 }, { date: "2026-03-07", value: 142 }
    ]
  },
  {
    id: "fulfill-analytics", label: "Fulfillment Analytics", category: "fulfillment",
    metrics: [
      { id: "m5", label: "On-Time Delivery", current: 94, previous: 91, unit: "%", trend: "up" },
      { id: "m6", label: "Avg Lead Time", current: 5.1, previous: 5.8, unit: "days", trend: "down" },
      { id: "m7", label: "Order Fill Rate", current: 97, previous: 95, unit: "%", trend: "up" },
      { id: "m8", label: "Return Rate", current: 1.2, previous: 1.5, unit: "%", trend: "down" }
    ],
    trend: [
      { date: "2026-03-01", value: 91 }, { date: "2026-03-02", value: 93 }, { date: "2026-03-03", value: 90 },
      { date: "2026-03-04", value: 94 }, { date: "2026-03-05", value: 92 }, { date: "2026-03-06", value: 95 }, { date: "2026-03-07", value: 94 }
    ]
  },
  {
    id: "inv-analytics", label: "Inventory Analytics", category: "inventory",
    metrics: [
      { id: "m9", label: "Stock Turnover", current: 6.2, previous: 5.9, unit: "x", trend: "up" },
      { id: "m10", label: "Carrying Cost", current: 42000, previous: 45000, unit: "$", trend: "down" },
      { id: "m11", label: "Stockout Events", current: 2, previous: 5, unit: "events", trend: "down" },
      { id: "m12", label: "Days on Hand", current: 18, previous: 22, unit: "days", trend: "down" }
    ],
    trend: [
      { date: "2026-03-01", value: 5.8 }, { date: "2026-03-02", value: 5.9 }, { date: "2026-03-03", value: 6.0 },
      { date: "2026-03-04", value: 6.1 }, { date: "2026-03-05", value: 5.9 }, { date: "2026-03-06", value: 6.3 }, { date: "2026-03-07", value: 6.2 }
    ]
  }
];
