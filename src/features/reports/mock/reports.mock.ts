import type { ReportData } from "@features/reports/types/reports.types";

export const reportsMock: ReportData[] = [
  {
    type: "production", title: "Production Report", generatedAt: "2026-03-07T08:00:00Z",
    rows: [
      { id: "r1", label: "Total Jobs Completed", value: "142", change: "+12%", direction: "up" },
      { id: "r2", label: "Avg Completion Time", value: "4.2 days", change: "-8%", direction: "down" },
      { id: "r3", label: "Line Utilization", value: "82%", change: "+3%", direction: "up" },
      { id: "r4", label: "Blocked Jobs", value: "3", change: "+1", direction: "up" }
    ]
  },
  {
    type: "orders", title: "Orders Report", generatedAt: "2026-03-07T08:00:00Z",
    rows: [
      { id: "r5", label: "Open Orders", value: "248", change: "+18", direction: "up" },
      { id: "r6", label: "On-Time Fulfillment", value: "91%", change: "+2%", direction: "up" },
      { id: "r7", label: "Avg Order Value", value: "$12,400", change: "+5%", direction: "up" },
      { id: "r8", label: "Delayed Orders", value: "14", change: "-3", direction: "down" }
    ]
  },
  {
    type: "inventory", title: "Inventory Report", generatedAt: "2026-03-07T08:00:00Z",
    rows: [
      { id: "r9", label: "Total SKUs", value: "2", change: "0", direction: "flat" },
      { id: "r10", label: "Low Stock Items", value: "1", change: "+1", direction: "up" },
      { id: "r11", label: "Inventory Value", value: "$1.2M", change: "-4%", direction: "down" },
      { id: "r12", label: "Stock Turnover", value: "6.2x", change: "+0.3", direction: "up" }
    ]
  },
  {
    type: "shipments", title: "Shipments Report", generatedAt: "2026-03-07T08:00:00Z",
    rows: [
      { id: "r13", label: "Shipments This Month", value: "89", change: "+15%", direction: "up" },
      { id: "r14", label: "On-Time Delivery", value: "94%", change: "+1%", direction: "up" },
      { id: "r15", label: "Avg Transit Time", value: "2.8 days", change: "-0.2", direction: "down" },
      { id: "r16", label: "Delayed Shipments", value: "4", change: "+2", direction: "up" }
    ]
  }
];
