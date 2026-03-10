import {
  ProductionOrderStatus,
  ProductionPriority,
  ProductionSourceType,
  ExecutionStatus,
  MachineStatus,
  ScrapReasonType,
  DowntimeReasonType,
  QualityCheckType,
  QualityCheckStatus,
  type ProductionOrderSummary
} from "@features/production/types/production.types";

/* ── Production order status ──────────────────────── */

export function orderStatusLabel(s: ProductionOrderStatus): string {
  const m: Record<ProductionOrderStatus, string> = {
    [ProductionOrderStatus.Draft]: "Draft",
    [ProductionOrderStatus.Planned]: "Planned",
    [ProductionOrderStatus.Released]: "Released",
    [ProductionOrderStatus.InProgress]: "In Progress",
    [ProductionOrderStatus.Paused]: "Paused",
    [ProductionOrderStatus.Completed]: "Completed",
    [ProductionOrderStatus.Closed]: "Closed",
    [ProductionOrderStatus.Cancelled]: "Cancelled"
  };
  return m[s] ?? "Unknown";
}

export function orderStatusColor(s: ProductionOrderStatus): string {
  switch (s) {
    case ProductionOrderStatus.Draft: return "#94a3b8";
    case ProductionOrderStatus.Planned: return "#8b5cf6";
    case ProductionOrderStatus.Released: return "#3b82f6";
    case ProductionOrderStatus.InProgress: return "#f59e0b";
    case ProductionOrderStatus.Paused: return "#f97316";
    case ProductionOrderStatus.Completed: return "#10b981";
    case ProductionOrderStatus.Closed: return "#64748b";
    case ProductionOrderStatus.Cancelled: return "#ef4444";
    default: return "#94a3b8";
  }
}

/* ── Priority ─────────────────────────────────────── */

export function priorityLabel(p: ProductionPriority): string {
  const m: Record<ProductionPriority, string> = {
    [ProductionPriority.Low]: "Low",
    [ProductionPriority.Medium]: "Medium",
    [ProductionPriority.High]: "High",
    [ProductionPriority.Urgent]: "Urgent"
  };
  return m[p] ?? "Normal";
}

export function priorityColor(p: ProductionPriority): string {
  switch (p) {
    case ProductionPriority.Low: return "#94a3b8";
    case ProductionPriority.Medium: return "#3b82f6";
    case ProductionPriority.High: return "#f59e0b";
    case ProductionPriority.Urgent: return "#ef4444";
    default: return "#94a3b8";
  }
}

/* ── Source type ───────────────────────────────────── */

export function sourceTypeLabel(s: ProductionSourceType): string {
  const m: Record<ProductionSourceType, string> = {
    [ProductionSourceType.Manual]: "Manual",
    [ProductionSourceType.SalesOrder]: "Sales Order",
    [ProductionSourceType.Replenishment]: "Replenishment",
    [ProductionSourceType.Forecast]: "Forecast",
    [ProductionSourceType.TransferDemand]: "Transfer Demand"
  };
  return m[s] ?? "Unknown";
}

/* ── Execution status ─────────────────────────────── */

export function executionStatusLabel(s: ExecutionStatus): string {
  const m: Record<ExecutionStatus, string> = {
    [ExecutionStatus.Pending]: "Pending",
    [ExecutionStatus.Ready]: "Ready",
    [ExecutionStatus.Running]: "Running",
    [ExecutionStatus.Paused]: "Paused",
    [ExecutionStatus.Completed]: "Completed",
    [ExecutionStatus.Cancelled]: "Cancelled"
  };
  return m[s] ?? "Unknown";
}

export function executionStatusColor(s: ExecutionStatus): string {
  switch (s) {
    case ExecutionStatus.Pending: return "#94a3b8";
    case ExecutionStatus.Ready: return "#3b82f6";
    case ExecutionStatus.Running: return "#f59e0b";
    case ExecutionStatus.Paused: return "#f97316";
    case ExecutionStatus.Completed: return "#10b981";
    case ExecutionStatus.Cancelled: return "#ef4444";
    default: return "#94a3b8";
  }
}

/* ── Machine status ───────────────────────────────── */

export function machineStatusLabel(s: MachineStatus): string {
  const m: Record<MachineStatus, string> = {
    [MachineStatus.Idle]: "Idle",
    [MachineStatus.Running]: "Running",
    [MachineStatus.Down]: "Down",
    [MachineStatus.Maintenance]: "Maintenance",
    [MachineStatus.Retired]: "Retired"
  };
  return m[s] ?? "Unknown";
}

export function machineStatusColor(s: MachineStatus): string {
  switch (s) {
    case MachineStatus.Idle: return "#94a3b8";
    case MachineStatus.Running: return "#10b981";
    case MachineStatus.Down: return "#ef4444";
    case MachineStatus.Maintenance: return "#f59e0b";
    case MachineStatus.Retired: return "#64748b";
    default: return "#94a3b8";
  }
}

/* ── Scrap reason ─────────────────────────────────── */

export function scrapReasonLabel(r: ScrapReasonType): string {
  const m: Record<ScrapReasonType, string> = {
    [ScrapReasonType.Defect]: "Defect",
    [ScrapReasonType.Damage]: "Damage",
    [ScrapReasonType.Overproduction]: "Overproduction",
    [ScrapReasonType.SetupLoss]: "Setup Loss",
    [ScrapReasonType.Expired]: "Expired",
    [ScrapReasonType.Contamination]: "Contamination",
    [ScrapReasonType.Other]: "Other"
  };
  return m[r] ?? "Unknown";
}

/* ── Downtime reason ──────────────────────────────── */

export function downtimeReasonLabel(r: DowntimeReasonType): string {
  const m: Record<DowntimeReasonType, string> = {
    [DowntimeReasonType.MachineBreakdown]: "Machine Breakdown",
    [DowntimeReasonType.PowerFailure]: "Power Failure",
    [DowntimeReasonType.MaterialShortage]: "Material Shortage",
    [DowntimeReasonType.Changeover]: "Changeover",
    [DowntimeReasonType.Maintenance]: "Maintenance",
    [DowntimeReasonType.QualityIssue]: "Quality Issue",
    [DowntimeReasonType.OperatorUnavailable]: "Operator Unavailable",
    [DowntimeReasonType.Other]: "Other"
  };
  return m[r] ?? "Unknown";
}

/* ── Quality check ────────────────────────────────── */

export function qcTypeLabel(t: QualityCheckType): string {
  const m: Record<QualityCheckType, string> = {
    [QualityCheckType.Incoming]: "Incoming",
    [QualityCheckType.InProcess]: "In-Process",
    [QualityCheckType.Final]: "Final",
    [QualityCheckType.ReworkVerification]: "Rework Verification"
  };
  return m[t] ?? "Unknown";
}

export function qcStatusLabel(s: QualityCheckStatus): string {
  const m: Record<QualityCheckStatus, string> = {
    [QualityCheckStatus.Pending]: "Pending",
    [QualityCheckStatus.Passed]: "Passed",
    [QualityCheckStatus.Failed]: "Failed",
    [QualityCheckStatus.ConditionalPass]: "Conditional"
  };
  return m[s] ?? "Unknown";
}

export function qcStatusColor(s: QualityCheckStatus): string {
  switch (s) {
    case QualityCheckStatus.Pending: return "#94a3b8";
    case QualityCheckStatus.Passed: return "#10b981";
    case QualityCheckStatus.Failed: return "#ef4444";
    case QualityCheckStatus.ConditionalPass: return "#f59e0b";
    default: return "#94a3b8";
  }
}

/* ── Helpers ──────────────────────────────────────── */

export function progressPercent(order: ProductionOrderSummary): number {
  if (order.plannedQuantity <= 0) return 0;
  return Math.min(100, Math.round((order.producedQuantity / order.plannedQuantity) * 100));
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
