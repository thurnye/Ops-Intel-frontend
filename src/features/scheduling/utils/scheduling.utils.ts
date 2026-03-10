import {
  SchedulePlanStatus,
  ScheduleJobStatus,
  ScheduleOperationStatus,
  DispatchStatus,
  AssignmentStatus,
  CapacityReservationStatus,
  ScheduleExceptionStatus,
  ScheduleGenerationMode,
  SchedulingStrategy,
  DependencyType,
  ResourceType,
  CalendarExceptionType,
  OperationConstraintType,
  ScheduleExceptionType,
  SchedulePriority,
  ScheduleExceptionSeverity,
  MaterialReadinessStatus
} from "@features/scheduling/types/scheduling.types";

/* ── Schedule plan status ────────────────────────── */

export function planStatusLabel(s: SchedulePlanStatus): string {
  const m: Record<SchedulePlanStatus, string> = {
    [SchedulePlanStatus.Draft]: "Draft",
    [SchedulePlanStatus.Published]: "Published",
    [SchedulePlanStatus.InProgress]: "In Progress",
    [SchedulePlanStatus.Closed]: "Closed",
    [SchedulePlanStatus.Cancelled]: "Cancelled"
  };
  return m[s] ?? "Unknown";
}

export function planStatusColor(s: SchedulePlanStatus): string {
  switch (s) {
    case SchedulePlanStatus.Draft: return "#94a3b8";
    case SchedulePlanStatus.Published: return "#3b82f6";
    case SchedulePlanStatus.InProgress: return "#f59e0b";
    case SchedulePlanStatus.Closed: return "#64748b";
    case SchedulePlanStatus.Cancelled: return "#ef4444";
    default: return "#94a3b8";
  }
}

/* ── Schedule job status ─────────────────────────── */

export function jobStatusLabel(s: ScheduleJobStatus): string {
  const m: Record<ScheduleJobStatus, string> = {
    [ScheduleJobStatus.Unscheduled]: "Unscheduled",
    [ScheduleJobStatus.Scheduled]: "Scheduled",
    [ScheduleJobStatus.Released]: "Released",
    [ScheduleJobStatus.Running]: "Running",
    [ScheduleJobStatus.Paused]: "Paused",
    [ScheduleJobStatus.Completed]: "Completed",
    [ScheduleJobStatus.Delayed]: "Delayed",
    [ScheduleJobStatus.Blocked]: "Blocked",
    [ScheduleJobStatus.Cancelled]: "Cancelled"
  };
  return m[s] ?? "Unknown";
}

export function jobStatusColor(s: ScheduleJobStatus): string {
  switch (s) {
    case ScheduleJobStatus.Unscheduled: return "#94a3b8";
    case ScheduleJobStatus.Scheduled: return "#8b5cf6";
    case ScheduleJobStatus.Released: return "#3b82f6";
    case ScheduleJobStatus.Running: return "#f59e0b";
    case ScheduleJobStatus.Paused: return "#f97316";
    case ScheduleJobStatus.Completed: return "#10b981";
    case ScheduleJobStatus.Delayed: return "#ef4444";
    case ScheduleJobStatus.Blocked: return "#dc2626";
    case ScheduleJobStatus.Cancelled: return "#64748b";
    default: return "#94a3b8";
  }
}

/* ── Schedule operation status ───────────────────── */

export function operationStatusLabel(s: ScheduleOperationStatus): string {
  const m: Record<ScheduleOperationStatus, string> = {
    [ScheduleOperationStatus.Pending]: "Pending",
    [ScheduleOperationStatus.Ready]: "Ready",
    [ScheduleOperationStatus.Scheduled]: "Scheduled",
    [ScheduleOperationStatus.Released]: "Released",
    [ScheduleOperationStatus.Running]: "Running",
    [ScheduleOperationStatus.Paused]: "Paused",
    [ScheduleOperationStatus.Completed]: "Completed",
    [ScheduleOperationStatus.Delayed]: "Delayed",
    [ScheduleOperationStatus.Blocked]: "Blocked",
    [ScheduleOperationStatus.Cancelled]: "Cancelled"
  };
  return m[s] ?? "Unknown";
}

export function operationStatusColor(s: ScheduleOperationStatus): string {
  switch (s) {
    case ScheduleOperationStatus.Pending: return "#94a3b8";
    case ScheduleOperationStatus.Ready: return "#06b6d4";
    case ScheduleOperationStatus.Scheduled: return "#8b5cf6";
    case ScheduleOperationStatus.Released: return "#3b82f6";
    case ScheduleOperationStatus.Running: return "#f59e0b";
    case ScheduleOperationStatus.Paused: return "#f97316";
    case ScheduleOperationStatus.Completed: return "#10b981";
    case ScheduleOperationStatus.Delayed: return "#ef4444";
    case ScheduleOperationStatus.Blocked: return "#dc2626";
    case ScheduleOperationStatus.Cancelled: return "#64748b";
    default: return "#94a3b8";
  }
}

/* ── Dispatch status ─────────────────────────────── */

export function dispatchStatusLabel(s: DispatchStatus): string {
  const m: Record<DispatchStatus, string> = {
    [DispatchStatus.NotDispatched]: "Not Dispatched",
    [DispatchStatus.Dispatched]: "Dispatched",
    [DispatchStatus.Acknowledged]: "Acknowledged",
    [DispatchStatus.InExecution]: "In Execution",
    [DispatchStatus.Completed]: "Completed",
    [DispatchStatus.Skipped]: "Skipped"
  };
  return m[s] ?? "Unknown";
}

export function dispatchStatusColor(s: DispatchStatus): string {
  switch (s) {
    case DispatchStatus.NotDispatched: return "#94a3b8";
    case DispatchStatus.Dispatched: return "#3b82f6";
    case DispatchStatus.Acknowledged: return "#8b5cf6";
    case DispatchStatus.InExecution: return "#f59e0b";
    case DispatchStatus.Completed: return "#10b981";
    case DispatchStatus.Skipped: return "#64748b";
    default: return "#94a3b8";
  }
}

/* ── Assignment status ───────────────────────────── */

export function assignmentStatusLabel(s: AssignmentStatus): string {
  const m: Record<AssignmentStatus, string> = {
    [AssignmentStatus.Planned]: "Planned",
    [AssignmentStatus.Confirmed]: "Confirmed",
    [AssignmentStatus.Reassigned]: "Reassigned",
    [AssignmentStatus.Removed]: "Removed"
  };
  return m[s] ?? "Unknown";
}

/* ── Capacity reservation status ─────────────────── */

export function capacityStatusLabel(s: CapacityReservationStatus): string {
  const m: Record<CapacityReservationStatus, string> = {
    [CapacityReservationStatus.Reserved]: "Reserved",
    [CapacityReservationStatus.Released]: "Released",
    [CapacityReservationStatus.Consumed]: "Consumed",
    [CapacityReservationStatus.Cancelled]: "Cancelled"
  };
  return m[s] ?? "Unknown";
}

/* ── Exception status ────────────────────────────── */

export function exceptionStatusLabel(s: ScheduleExceptionStatus): string {
  const m: Record<ScheduleExceptionStatus, string> = {
    [ScheduleExceptionStatus.Open]: "Open",
    [ScheduleExceptionStatus.Investigating]: "Investigating",
    [ScheduleExceptionStatus.Resolved]: "Resolved",
    [ScheduleExceptionStatus.Ignored]: "Ignored"
  };
  return m[s] ?? "Unknown";
}

export function exceptionStatusColor(s: ScheduleExceptionStatus): string {
  switch (s) {
    case ScheduleExceptionStatus.Open: return "#ef4444";
    case ScheduleExceptionStatus.Investigating: return "#f59e0b";
    case ScheduleExceptionStatus.Resolved: return "#10b981";
    case ScheduleExceptionStatus.Ignored: return "#94a3b8";
    default: return "#94a3b8";
  }
}

/* ── Generation mode ─────────────────────────────── */

export function generationModeLabel(m: ScheduleGenerationMode): string {
  const map: Record<ScheduleGenerationMode, string> = {
    [ScheduleGenerationMode.Manual]: "Manual",
    [ScheduleGenerationMode.SemiAutomatic]: "Semi-Automatic",
    [ScheduleGenerationMode.Automatic]: "Automatic"
  };
  return map[m] ?? "Unknown";
}

/* ── Scheduling strategy ─────────────────────────── */

export function strategyLabel(s: SchedulingStrategy): string {
  const m: Record<SchedulingStrategy, string> = {
    [SchedulingStrategy.Forward]: "Forward",
    [SchedulingStrategy.Backward]: "Backward",
    [SchedulingStrategy.FiniteCapacity]: "Finite Capacity",
    [SchedulingStrategy.InfiniteCapacity]: "Infinite Capacity",
    [SchedulingStrategy.ConstraintBased]: "Constraint-Based"
  };
  return m[s] ?? "Unknown";
}

/* ── Dependency type ─────────────────────────────── */

export function dependencyTypeLabel(d: DependencyType): string {
  const m: Record<DependencyType, string> = {
    [DependencyType.FinishToStart]: "Finish-to-Start",
    [DependencyType.StartToStart]: "Start-to-Start",
    [DependencyType.FinishToFinish]: "Finish-to-Finish",
    [DependencyType.StartToFinish]: "Start-to-Finish"
  };
  return m[d] ?? "Unknown";
}

/* ── Resource type ───────────────────────────────── */

export function resourceTypeLabel(r: ResourceType): string {
  const m: Record<ResourceType, string> = {
    [ResourceType.WorkCenter]: "Work Center",
    [ResourceType.Machine]: "Machine",
    [ResourceType.Employee]: "Employee",
    [ResourceType.Tool]: "Tool",
    [ResourceType.Vehicle]: "Vehicle",
    [ResourceType.ExternalVendor]: "External Vendor"
  };
  return m[r] ?? "Unknown";
}

/* ── Calendar exception type ─────────────────────── */

export function calendarExceptionTypeLabel(t: CalendarExceptionType): string {
  const m: Record<CalendarExceptionType, string> = {
    [CalendarExceptionType.Holiday]: "Holiday",
    [CalendarExceptionType.Maintenance]: "Maintenance",
    [CalendarExceptionType.Breakdown]: "Breakdown",
    [CalendarExceptionType.Training]: "Training",
    [CalendarExceptionType.Shutdown]: "Shutdown",
    [CalendarExceptionType.OvertimeWindow]: "Overtime Window",
    [CalendarExceptionType.Blocked]: "Blocked"
  };
  return m[t] ?? "Unknown";
}

/* ── Operation constraint type ───────────────────── */

export function constraintTypeLabel(c: OperationConstraintType): string {
  const m: Record<OperationConstraintType, string> = {
    [OperationConstraintType.PredecessorOperation]: "Predecessor Operation",
    [OperationConstraintType.MaterialAvailability]: "Material Availability",
    [OperationConstraintType.QualityRelease]: "Quality Release",
    [OperationConstraintType.ToolAvailability]: "Tool Availability",
    [OperationConstraintType.ExternalProcessCompletion]: "External Process",
    [OperationConstraintType.LaborAvailability]: "Labor Availability"
  };
  return m[c] ?? "Unknown";
}

/* ── Exception type ──────────────────────────────── */

export function exceptionTypeLabel(t: ScheduleExceptionType): string {
  const m: Record<ScheduleExceptionType, string> = {
    [ScheduleExceptionType.MaterialShortage]: "Material Shortage",
    [ScheduleExceptionType.MachineBreakdown]: "Machine Breakdown",
    [ScheduleExceptionType.LaborUnavailable]: "Labor Unavailable",
    [ScheduleExceptionType.QualityHold]: "Quality Hold",
    [ScheduleExceptionType.UpstreamDelay]: "Upstream Delay",
    [ScheduleExceptionType.CapacityConflict]: "Capacity Conflict",
    [ScheduleExceptionType.DueDateRisk]: "Due Date Risk",
    [ScheduleExceptionType.ManualOverride]: "Manual Override"
  };
  return m[t] ?? "Unknown";
}

/* ── Priority ────────────────────────────────────── */

export function priorityLabel(p: SchedulePriority): string {
  const m: Record<SchedulePriority, string> = {
    [SchedulePriority.Low]: "Low",
    [SchedulePriority.Normal]: "Normal",
    [SchedulePriority.High]: "High",
    [SchedulePriority.Urgent]: "Urgent",
    [SchedulePriority.Critical]: "Critical"
  };
  return m[p] ?? "Normal";
}

export function priorityColor(p: SchedulePriority): string {
  switch (p) {
    case SchedulePriority.Low: return "#94a3b8";
    case SchedulePriority.Normal: return "#3b82f6";
    case SchedulePriority.High: return "#f59e0b";
    case SchedulePriority.Urgent: return "#ef4444";
    case SchedulePriority.Critical: return "#dc2626";
    default: return "#94a3b8";
  }
}

/* ── Severity ────────────────────────────────────── */

export function severityLabel(s: ScheduleExceptionSeverity): string {
  const m: Record<ScheduleExceptionSeverity, string> = {
    [ScheduleExceptionSeverity.Low]: "Low",
    [ScheduleExceptionSeverity.Medium]: "Medium",
    [ScheduleExceptionSeverity.High]: "High",
    [ScheduleExceptionSeverity.Critical]: "Critical"
  };
  return m[s] ?? "Unknown";
}

export function severityColor(s: ScheduleExceptionSeverity): string {
  switch (s) {
    case ScheduleExceptionSeverity.Low: return "#94a3b8";
    case ScheduleExceptionSeverity.Medium: return "#f59e0b";
    case ScheduleExceptionSeverity.High: return "#ef4444";
    case ScheduleExceptionSeverity.Critical: return "#dc2626";
    default: return "#94a3b8";
  }
}

/* ── Material readiness ──────────────────────────── */

export function materialReadinessLabel(s: MaterialReadinessStatus): string {
  const m: Record<MaterialReadinessStatus, string> = {
    [MaterialReadinessStatus.NotChecked]: "Not Checked",
    [MaterialReadinessStatus.Ready]: "Ready",
    [MaterialReadinessStatus.PartiallyReady]: "Partially Ready",
    [MaterialReadinessStatus.Shortage]: "Shortage",
    [MaterialReadinessStatus.Reserved]: "Reserved",
    [MaterialReadinessStatus.WaitingTransfer]: "Waiting Transfer",
    [MaterialReadinessStatus.Blocked]: "Blocked"
  };
  return m[s] ?? "Unknown";
}

export function materialReadinessColor(s: MaterialReadinessStatus): string {
  switch (s) {
    case MaterialReadinessStatus.NotChecked: return "#94a3b8";
    case MaterialReadinessStatus.Ready: return "#10b981";
    case MaterialReadinessStatus.PartiallyReady: return "#f59e0b";
    case MaterialReadinessStatus.Shortage: return "#ef4444";
    case MaterialReadinessStatus.Reserved: return "#3b82f6";
    case MaterialReadinessStatus.WaitingTransfer: return "#8b5cf6";
    case MaterialReadinessStatus.Blocked: return "#dc2626";
    default: return "#94a3b8";
  }
}

/* ── Helpers ──────────────────────────────────────── */

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function jobProgressPercent(completed: number, planned: number): number {
  if (planned <= 0) return 0;
  return Math.min(100, Math.round((completed / planned) * 100));
}

export function capacityUtilizationPercent(reserved: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((reserved / total) * 100));
}
