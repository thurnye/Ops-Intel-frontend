export type WorkOrder = {
  id: string;
  line: string;
  status: "scheduled" | "in_progress" | "completed" | "blocked";
  dueAt: string;
};
