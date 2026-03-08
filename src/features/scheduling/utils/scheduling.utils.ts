import type { ScheduleStatus } from "@features/scheduling/types/scheduling.types";

export function scheduleStatusLabel(status: ScheduleStatus): string {
  const map: Record<ScheduleStatus, string> = {
    planned: "Planned",
    confirmed: "Confirmed",
    in_progress: "In Progress",
    completed: "Completed",
    conflict: "Conflict"
  };
  return map[status];
}

export function scheduleStatusColor(status: ScheduleStatus): "default" | "info" | "primary" | "success" | "error" {
  const map: Record<ScheduleStatus, "default" | "info" | "primary" | "success" | "error"> = {
    planned: "default",
    confirmed: "info",
    in_progress: "primary",
    completed: "success",
    conflict: "error"
  };
  return map[status];
}
