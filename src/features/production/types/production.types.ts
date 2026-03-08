export type WorkOrderStatus = "scheduled" | "in_progress" | "completed" | "blocked";

export type WorkOrder = {
  id: string;
  orderId: string;
  product: string;
  line: string;
  status: WorkOrderStatus;
  progress: number;
  startedAt: string;
  dueAt: string;
};

export type ProductionFilters = {
  query: string;
  status: WorkOrderStatus | "";
  line: string;
};
