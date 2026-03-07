import type { WorkOrder } from "@features/production/types/production.types";

export const productionMock: WorkOrder[] = [
  {
    id: "wo-1243",
    line: "Lakeshore-2",
    status: "in_progress",
    dueAt: "2026-03-08T10:00:00Z"
  }
];
