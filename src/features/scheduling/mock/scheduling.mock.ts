import type { ScheduleEntry } from "@features/scheduling/types/scheduling.types";

export const schedulingMock: ScheduleEntry[] = [
  { id: "SCH-001", jobId: "WO-1243", line: "Lakeshore-2", product: "Battery enclosure", scheduledStart: "2026-03-07T06:00:00Z", scheduledEnd: "2026-03-07T14:00:00Z", assignedTo: "Team Alpha", status: "in_progress" },
  { id: "SCH-002", jobId: "WO-1245", line: "Lakeshore-1", product: "Heat exchanger plate", scheduledStart: "2026-03-09T06:00:00Z", scheduledEnd: "2026-03-09T18:00:00Z", assignedTo: "Team Beta", status: "planned" },
  { id: "SCH-003", jobId: "WO-1247", line: "Northgate-1", product: "Railing assembly", scheduledStart: "2026-03-07T08:00:00Z", scheduledEnd: "2026-03-07T16:00:00Z", assignedTo: "Team Gamma", status: "confirmed" },
  { id: "SCH-004", jobId: "WO-1244", line: "Northgate-1", product: "Architectural frame", scheduledStart: "2026-03-08T06:00:00Z", scheduledEnd: "2026-03-08T14:00:00Z", assignedTo: "Team Alpha", status: "conflict" },
  { id: "SCH-005", jobId: "WO-1246", line: "Southport-3", product: "Cladding panel", scheduledStart: "2026-03-05T06:00:00Z", scheduledEnd: "2026-03-06T14:00:00Z", assignedTo: "Team Delta", status: "completed" }
];
