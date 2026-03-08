export type ScheduleStatus = "planned" | "confirmed" | "in_progress" | "completed" | "conflict";

export type ScheduleEntry = {
  id: string;
  jobId: string;
  line: string;
  product: string;
  scheduledStart: string;
  scheduledEnd: string;
  assignedTo: string;
  status: ScheduleStatus;
};

export type ScheduleFilters = {
  query: string;
  line: string;
  status: ScheduleStatus | "";
};
