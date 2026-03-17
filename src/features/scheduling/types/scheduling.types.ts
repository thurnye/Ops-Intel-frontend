/* ── Status enums ──────────────────────────────────── */

export enum SchedulePlanStatus {
  Draft = 1,
  Published = 2,
  InProgress = 3,
  Closed = 4,
  Cancelled = 5
}

export enum ScheduleJobStatus {
  Unscheduled = 1,
  Scheduled = 2,
  Released = 3,
  Running = 4,
  Paused = 5,
  Completed = 6,
  Delayed = 7,
  Blocked = 8,
  Cancelled = 9
}

export enum ScheduleOperationStatus {
  Pending = 1,
  Ready = 2,
  Scheduled = 3,
  Released = 4,
  Running = 5,
  Paused = 6,
  Completed = 7,
  Delayed = 8,
  Blocked = 9,
  Cancelled = 10
}

export enum DispatchStatus {
  NotDispatched = 1,
  Dispatched = 2,
  Acknowledged = 3,
  InExecution = 4,
  Completed = 5,
  Skipped = 6
}

export enum AssignmentStatus {
  Planned = 1,
  Confirmed = 2,
  Reassigned = 3,
  Removed = 4
}

export enum CapacityReservationStatus {
  Reserved = 1,
  Released = 2,
  Consumed = 3,
  Cancelled = 4
}

export enum ScheduleExceptionStatus {
  Open = 1,
  Investigating = 2,
  Resolved = 3,
  Ignored = 4
}

/* ── Type / strategy enums ────────────────────────── */

export enum ScheduleGenerationMode {
  Manual = 1,
  SemiAutomatic = 2,
  Automatic = 3
}

export enum SchedulingStrategy {
  Forward = 1,
  Backward = 2,
  FiniteCapacity = 3,
  InfiniteCapacity = 4,
  ConstraintBased = 5
}

export enum DependencyType {
  FinishToStart = 1,
  StartToStart = 2,
  FinishToFinish = 3,
  StartToFinish = 4
}

export enum ResourceType {
  WorkCenter = 1,
  Machine = 2,
  Employee = 3,
  Tool = 4,
  Vehicle = 5,
  ExternalVendor = 6
}

export enum CalendarExceptionType {
  Holiday = 1,
  Maintenance = 2,
  Breakdown = 3,
  Training = 4,
  Shutdown = 5,
  OvertimeWindow = 6,
  Blocked = 7
}

export enum OperationConstraintType {
  PredecessorOperation = 1,
  MaterialAvailability = 2,
  QualityRelease = 3,
  ToolAvailability = 4,
  ExternalProcessCompletion = 5,
  LaborAvailability = 6
}

export enum ScheduleExceptionType {
  MaterialShortage = 1,
  MachineBreakdown = 2,
  LaborUnavailable = 3,
  QualityHold = 4,
  UpstreamDelay = 5,
  CapacityConflict = 6,
  DueDateRisk = 7,
  ManualOverride = 8
}

/* ── Priority / severity enums ───────────────────── */

export enum SchedulePriority {
  Low = 1,
  Normal = 2,
  High = 3,
  Urgent = 4,
  Critical = 5
}

export enum ScheduleExceptionSeverity {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

/* ── Material readiness ──────────────────────────── */

export enum MaterialReadinessStatus {
  NotChecked = 1,
  Ready = 2,
  PartiallyReady = 3,
  Shortage = 4,
  Reserved = 5,
  WaitingTransfer = 6,
  Blocked = 7
}

/* ── Shared DTOs ─────────────────────────────────── */

export type SchedulingLookup = {
  id: string;
  code: string;
  name: string;
};

export type ShiftMetricsSummary = {
  totalShifts: number;
  activeShifts: number;
  overnightShifts: number;
  workCentersRepresented: number;
};

export type DispatchMetricsSummary = {
  totalJobs: number;
  releasedJobs: number;
  runningJobs: number;
  openBlockers: number;
};

export type SchedulingDateRange = {
  startUtc: string;
  endUtc: string;
};

export type SchedulingUserAction = {
  performedBy: string;
  performedAtUtc: string;
  reason?: string;
  notes?: string;
};

/* ── Schedule Plan ───────────────────────────────── */

export type SchedulePlan = {
  id: string;
  planNumber: string;
  name: string;
  description?: string;
  warehouseId: string;
  warehouseName?: string;
  planningStartDateUtc: string;
  planningEndDateUtc: string;
  status: SchedulePlanStatus;
  generationMode: ScheduleGenerationMode;
  schedulingStrategy: SchedulingStrategy;
  autoSequenceEnabled: boolean;
  autoDispatchEnabled: boolean;
  versionNumber: number;
  parentPlanId?: string;
  timeZone: string;
  approvedAtUtc?: string;
  approvedBy?: string;
  isActive: boolean;
  createdAtUtc: string;
};

export type ScheduleJobSummary = {
  id: string;
  jobNumber: string;
  jobName: string;
  plannedQuantity: number;
  status: ScheduleJobStatus;
  dueDateUtc: string;
};

export type SchedulePlanDetail = SchedulePlan & {
  totalJobs: number;
  totalOperations: number;
  totalExceptions: number;
  totalRevisions: number;
  jobs: ScheduleJobSummary[];
};

/* ── Schedule Job ────────────────────────────────── */

export type ScheduleOperationBrief = {
  id: string;
  sequenceNo: number;
  operationCode: string;
  operationName: string;
  plannedStartUtc: string;
  plannedEndUtc: string;
  status: ScheduleOperationStatus;
};

export type ScheduleJob = {
  id: string;
  schedulePlanId: string;
  productionOrderId: string;
  orderId?: string;
  productId: string;
  warehouseId: string;
  jobNumber: string;
  jobName: string;
  productName?: string;
  productSku?: string;
  warehouseName?: string;
  plannedQuantity: number;
  completedQuantity: number;
  scrapQuantity: number;
  plannedStartUtc: string;
  plannedEndUtc: string;
  actualStartUtc?: string;
  actualEndUtc?: string;
  dueDateUtc: string;
  priority: SchedulePriority;
  status: ScheduleJobStatus;
  materialReadinessStatus: MaterialReadinessStatus;
  createdAtUtc: string;
};

export type ScheduleMaterialCheck = {
  id: string;
  scheduleJobId: string;
  scheduleOperationId?: string;
  productionOrderId: string;
  routingStepId?: string;
  materialProductId: string;
  materialProductName?: string;
  warehouseId: string;
  warehouseName?: string;
  requiredQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  shortageQuantity: number;
  status: MaterialReadinessStatus;
  expectedAvailabilityDateUtc?: string;
  checkedAtUtc: string;
};

export type ScheduleJobDetail = ScheduleJob & {
  totalOperations: number;
  totalExceptions: number;
  totalMaterialChecks: number;
  operations: ScheduleOperationBrief[];
  materialChecks: ScheduleMaterialCheck[];
};

/* ── Schedule Operation ──────────────────────────── */

export type ScheduleOperation = {
  id: string;
  scheduleJobId: string;
  routingStepId: string;
  workCenterId: string;
  machineId?: string;
  productionExecutionId?: string;
  plannedShiftId?: string;
  actualShiftId?: string;
  sequenceNo: number;
  operationCode: string;
  operationName: string;
  workCenterName?: string;
  machineName?: string;
  shiftName?: string;
  plannedStartUtc: string;
  plannedEndUtc: string;
  actualStartUtc?: string;
  actualEndUtc?: string;
  plannedSetupMinutes: number;
  plannedRunMinutes: number;
  plannedTeardownMinutes: number;
  actualSetupMinutes?: number;
  actualRunMinutes?: number;
  actualTeardownMinutes?: number;
  plannedQuantity: number;
  completedQuantity: number;
  scrapQuantity: number;
  status: ScheduleOperationStatus;
  dispatchStatus: DispatchStatus;
  isCriticalPath: boolean;
  isBottleneckOperation: boolean;
  isOutsourced: boolean;
  priorityScore: number;
  createdAtUtc: string;
};

export type ScheduleOperationDependency = {
  id: string;
  predecessorOperationId: string;
  predecessorOperationName: string;
  successorOperationId: string;
  successorOperationName: string;
  dependencyType: DependencyType;
  lagMinutes: number;
  isMandatory: boolean;
};

export type ScheduleOperationConstraint = {
  id: string;
  constraintType: OperationConstraintType;
  referenceNo: string;
  description: string;
  isSatisfied: boolean;
  satisfiedAtUtc?: string;
  isMandatory: boolean;
};

export type ScheduleResourceOption = {
  id: string;
  scheduleOperationId: string;
  resourceId: string;
  resourceType: ResourceType;
  isPrimaryOption: boolean;
  preferenceRank: number;
  efficiencyFactor: number;
  setupPenaltyMinutes: number;
  isActive: boolean;
};

export type ScheduleResourceAssignment = {
  id: string;
  scheduleOperationId: string;
  resourceId: string;
  resourceType: ResourceType;
  shiftId?: string;
  assignmentRole: string;
  isPrimary: boolean;
  assignedStartUtc: string;
  assignedEndUtc: string;
  plannedHours: number;
  actualHours?: number;
  status: AssignmentStatus;
};

export type ScheduleOperationDetail = ScheduleOperation & {
  dependencies: ScheduleOperationDependency[];
  constraints: ScheduleOperationConstraint[];
  resourceOptions: ScheduleResourceOption[];
  resourceAssignments: ScheduleResourceAssignment[];
  capacityReservations: CapacityReservation[];
  dispatchQueueItems: DispatchQueueItem[];
};

/* ── Dispatch ────────────────────────────────────── */

export type DispatchQueueItem = {
  id: string;
  scheduleOperationId: string;
  workCenterId: string;
  machineId?: string;
  operationName?: string;
  workCenterName?: string;
  machineName?: string;
  queuePosition: number;
  priorityScore: number;
  status: DispatchStatus;
  releasedAtUtc?: string;
  acknowledgedAtUtc?: string;
  dispatchNotes?: string;
  isActive: boolean;
};

/* ── Shift ────────────────────────────────────────── */

export type Shift = {
  id: string;
  warehouseId: string;
  workCenterId?: string;
  warehouseName?: string;
  workCenterName?: string;
  shiftCode: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  crossesMidnight: boolean;
  isActive: boolean;
  capacityMinutes: number;
  breakMinutes: number;
};

export type ShiftUpsertPayload = {
  warehouseId: string;
  workCenterId?: string;
  shiftCode: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  crossesMidnight: boolean;
  capacityMinutes: number;
  breakMinutes: number;
};

/* ── Resource Calendar ───────────────────────────── */

export type ResourceCalendarException = {
  id: string;
  exceptionStartUtc: string;
  exceptionEndUtc: string;
  exceptionType: CalendarExceptionType;
  isWorkingException: boolean;
  reason: string;
  notes?: string;
};

export type ResourceCalendar = {
  id: string;
  resourceId: string;
  resourceType: ResourceType;
  calendarName: string;
  timeZone: string;
  mondayEnabled: boolean;
  tuesdayEnabled: boolean;
  wednesdayEnabled: boolean;
  thursdayEnabled: boolean;
  fridayEnabled: boolean;
  saturdayEnabled: boolean;
  sundayEnabled: boolean;
  defaultStartTime: string;
  defaultEndTime: string;
  isDefault: boolean;
  exceptions: ResourceCalendarException[];
};

/* ── Capacity ────────────────────────────────────── */

export type CapacityReservation = {
  id: string;
  scheduleOperationId: string;
  resourceId: string;
  resourceType: ResourceType;
  shiftId?: string;
  reservedStartUtc: string;
  reservedEndUtc: string;
  reservedMinutes: number;
  availableMinutesAtBooking: number;
  status: CapacityReservationStatus;
  reservationReason?: string;
};

export type ResourceCapacitySnapshot = {
  id: string;
  resourceId: string;
  resourceType: ResourceType;
  resourceName?: string;
  snapshotDateUtc: string;
  shiftId?: string;
  shiftName?: string;
  totalCapacityMinutes: number;
  reservedMinutes: number;
  availableMinutes: number;
  overtimeMinutes: number;
  isOverloaded: boolean;
  isBottleneck: boolean;
};

/* ── Exceptions ──────────────────────────────────── */

export type ScheduleException = {
  id: string;
  schedulePlanId: string;
  scheduleJobId?: string;
  scheduleOperationId?: string;
  exceptionType: ScheduleExceptionType;
  severity: ScheduleExceptionSeverity;
  title: string;
  description: string;
  detectedAtUtc: string;
  resolvedAtUtc?: string;
  assignedTo?: string;
  status: ScheduleExceptionStatus;
  resolutionNotes?: string;
};

/* ── Revisions / History ─────────────────────────── */

export type ScheduleRevision = {
  id: string;
  schedulePlanId: string;
  revisionNo: number;
  revisionType: string;
  changeSummary: string;
  reason?: string;
  revisedAtUtc: string;
  snapshotJson?: string;
};

export type ScheduleStatusHistory = {
  id: string;
  schedulePlanId?: string;
  scheduleJobId?: string;
  scheduleOperationId?: string;
  entityType: string;
  oldStatus: number;
  newStatus: number;
  reason?: string;
  notes?: string;
  changedAtUtc: string;
};

export type ScheduleRescheduleHistory = {
  id: string;
  schedulePlanId: string;
  scheduleJobId?: string;
  scheduleOperationId?: string;
  oldPlannedStartUtc: string;
  oldPlannedEndUtc: string;
  newPlannedStartUtc: string;
  newPlannedEndUtc: string;
  oldWorkCenterId?: string;
  oldWorkCenterName?: string;
  newWorkCenterId?: string;
  newWorkCenterName?: string;
  oldMachineId?: string;
  oldMachineName?: string;
  newMachineId?: string;
  newMachineName?: string;
  reasonCode?: string;
  reasonDescription?: string;
  changedAtUtc: string;
};

/* ── Audit ────────────────────────────────────────── */

export type ScheduleAuditLog = {
  id: string;
  entityName: string;
  entityId: string;
  actionType: string;
  changedFieldsJson?: string;
  oldValuesJson?: string;
  newValuesJson?: string;
  source: string;
  reason?: string;
  performedAtUtc: string;
  correlationId?: string;
};

/* ── Filters ─────────────────────────────────────── */

export type SchedulePlanFilters = {
  query: string;
  status: SchedulePlanStatus | "all";
  generationMode: ScheduleGenerationMode | "all";
  schedulingStrategy: SchedulingStrategy | "all";
  isActive: boolean | "all";
  startDate: string;
  endDate: string;
};

export type ScheduleJobFilters = {
  query: string;
  status: ScheduleJobStatus | "all";
  priority: SchedulePriority | "all";
  materialReadinessStatus: MaterialReadinessStatus | "all";
  isRushOrder: boolean | "all";
  startDate: string;
  endDate: string;
};

export type ScheduleExceptionFilters = {
  query: string;
  status: ScheduleExceptionStatus | "all";
  severity: ScheduleExceptionSeverity | "all";
  assignedTo: string;
  startDate: string;
  endDate: string;
};

export type SchedulePlanUpsertPayload = {
  planNumber?: string;
  name: string;
  description?: string;
  warehouseId?: string;
  planningStartDateUtc: string;
  planningEndDateUtc: string;
  generationMode: ScheduleGenerationMode;
  schedulingStrategy: SchedulingStrategy;
  autoSequenceEnabled: boolean;
  autoDispatchEnabled: boolean;
  timeZone: string;
  isActive?: boolean;
};

export type ScheduleJobUpsertPayload = {
  schedulePlanId?: string;
  productionOrderId?: string;
  orderId?: string;
  orderItemId?: string;
  productId?: string;
  warehouseId?: string;
  jobNumber?: string;
  jobName: string;
  notes?: string;
  plannedQuantity: number;
  earliestStartUtc?: string;
  latestFinishUtc?: string;
  dueDateUtc?: string;
  priority: SchedulePriority;
  isRushOrder: boolean;
  qualityHold: boolean;
};
