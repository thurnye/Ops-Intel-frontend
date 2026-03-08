import type { WorkOrder } from "@features/production/types/production.types";

export const productionMock: WorkOrder[] = [
  { id: "WO-1243", orderId: "SO-1024", product: "Battery enclosure", line: "Lakeshore-2", status: "in_progress", progress: 65, startedAt: "2026-03-05T08:00:00Z", dueAt: "2026-03-08T10:00:00Z" },
  { id: "WO-1244", orderId: "SO-1025", product: "Architectural frame", line: "Northgate-1", status: "blocked", progress: 30, startedAt: "2026-03-04T07:00:00Z", dueAt: "2026-03-10T16:00:00Z" },
  { id: "WO-1245", orderId: "SO-1026", product: "Heat exchanger plate", line: "Lakeshore-1", status: "scheduled", progress: 0, startedAt: "2026-03-09T06:00:00Z", dueAt: "2026-03-12T18:00:00Z" },
  { id: "WO-1246", orderId: "SO-1027", product: "Cladding panel", line: "Southport-3", status: "completed", progress: 100, startedAt: "2026-03-01T08:00:00Z", dueAt: "2026-03-06T14:00:00Z" },
  { id: "WO-1247", orderId: "SO-1028", product: "Railing assembly", line: "Northgate-1", status: "in_progress", progress: 82, startedAt: "2026-03-03T09:00:00Z", dueAt: "2026-03-07T12:00:00Z" }
];
