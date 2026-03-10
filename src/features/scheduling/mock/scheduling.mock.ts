import {
  SchedulePlanStatus,
  ScheduleJobStatus,
  ScheduleOperationStatus,
  ScheduleGenerationMode,
  SchedulingStrategy,
  SchedulePriority,
  ScheduleExceptionType,
  ScheduleExceptionSeverity,
  ScheduleExceptionStatus,
  MaterialReadinessStatus,
  type SchedulePlan,
  type ScheduleJob,
  type SchedulePlanDetail,
  type ScheduleJobDetail,
  type ScheduleException,
  type Shift,
  type ResourceCapacitySnapshot,
  ResourceType
} from "@features/scheduling/types/scheduling.types";

/* ── Schedule Plans ──────────────────────────────── */

export const schedulePlansMock: SchedulePlan[] = [
  {
    id: "sp-1",
    planNumber: "SP-2026-001",
    name: "March Week 1 Production Plan",
    description: "Weekly plan covering extrusion and assembly operations",
    warehouseId: "wh-1",
    warehouseName: "Plant A Warehouse",
    planningStartDateUtc: "2026-03-01T00:00:00Z",
    planningEndDateUtc: "2026-03-07T23:59:59Z",
    status: SchedulePlanStatus.InProgress,
    generationMode: ScheduleGenerationMode.SemiAutomatic,
    schedulingStrategy: SchedulingStrategy.FiniteCapacity,
    autoSequenceEnabled: true,
    autoDispatchEnabled: false,
    versionNumber: 2,
    timeZone: "America/New_York",
    approvedAtUtc: "2026-02-28T16:00:00Z",
    approvedBy: "Sarah Chen",
    isActive: true,
    createdAtUtc: "2026-02-27T10:00:00Z"
  },
  {
    id: "sp-2",
    planNumber: "SP-2026-002",
    name: "March Week 2 Production Plan",
    warehouseId: "wh-1",
    warehouseName: "Plant A Warehouse",
    planningStartDateUtc: "2026-03-08T00:00:00Z",
    planningEndDateUtc: "2026-03-14T23:59:59Z",
    status: SchedulePlanStatus.Draft,
    generationMode: ScheduleGenerationMode.Automatic,
    schedulingStrategy: SchedulingStrategy.Forward,
    autoSequenceEnabled: true,
    autoDispatchEnabled: true,
    versionNumber: 1,
    timeZone: "America/New_York",
    isActive: true,
    createdAtUtc: "2026-03-05T09:00:00Z"
  },
  {
    id: "sp-3",
    planNumber: "SP-2026-003",
    name: "February Final Week Plan",
    warehouseId: "wh-1",
    warehouseName: "Plant A Warehouse",
    planningStartDateUtc: "2026-02-22T00:00:00Z",
    planningEndDateUtc: "2026-02-28T23:59:59Z",
    status: SchedulePlanStatus.Closed,
    generationMode: ScheduleGenerationMode.Manual,
    schedulingStrategy: SchedulingStrategy.FiniteCapacity,
    autoSequenceEnabled: false,
    autoDispatchEnabled: false,
    versionNumber: 3,
    timeZone: "America/New_York",
    approvedAtUtc: "2026-02-21T14:00:00Z",
    approvedBy: "Mike Johnson",
    isActive: false,
    createdAtUtc: "2026-02-20T08:00:00Z"
  }
];

/* ── Schedule Jobs ───────────────────────────────── */

export const scheduleJobsMock: ScheduleJob[] = [
  {
    id: "sj-1",
    schedulePlanId: "sp-1",
    productionOrderId: "po-1",
    productId: "prod-1",
    warehouseId: "wh-1",
    jobNumber: "SJ-2026-001",
    jobName: "6061 Aluminum Extrusion Run",
    productName: "6061 Aluminum Extrusion Bar",
    productSku: "ALU-6061-BAR",
    warehouseName: "Plant A Warehouse",
    plannedQuantity: 1200,
    completedQuantity: 780,
    scrapQuantity: 15,
    plannedStartUtc: "2026-03-01T06:00:00Z",
    plannedEndUtc: "2026-03-05T18:00:00Z",
    actualStartUtc: "2026-03-01T06:30:00Z",
    dueDateUtc: "2026-03-08T18:00:00Z",
    priority: SchedulePriority.High,
    status: ScheduleJobStatus.Running,
    materialReadinessStatus: MaterialReadinessStatus.Ready,
    createdAtUtc: "2026-02-27T10:30:00Z"
  },
  {
    id: "sj-2",
    schedulePlanId: "sp-1",
    productionOrderId: "po-3",
    productId: "prod-3",
    warehouseId: "wh-1",
    jobNumber: "SJ-2026-002",
    jobName: "Hydraulic Seal Kit Assembly",
    productName: "Hydraulic Cylinder Seal Kit",
    productSku: "HYD-SEAL-KIT",
    warehouseName: "Plant A Warehouse",
    plannedQuantity: 500,
    completedQuantity: 500,
    scrapQuantity: 3,
    plannedStartUtc: "2026-03-01T06:00:00Z",
    plannedEndUtc: "2026-03-04T18:00:00Z",
    actualStartUtc: "2026-03-01T06:15:00Z",
    actualEndUtc: "2026-03-04T16:00:00Z",
    dueDateUtc: "2026-03-06T18:00:00Z",
    priority: SchedulePriority.Normal,
    status: ScheduleJobStatus.Completed,
    materialReadinessStatus: MaterialReadinessStatus.Ready,
    createdAtUtc: "2026-02-27T10:45:00Z"
  },
  {
    id: "sj-3",
    schedulePlanId: "sp-1",
    productionOrderId: "po-4",
    productId: "prod-4",
    warehouseId: "wh-2",
    jobNumber: "SJ-2026-003",
    jobName: "Adhesive Tape Roll Production",
    productName: "Industrial Adhesive Tape Roll",
    productSku: "ADH-VHB-25",
    warehouseName: "Distribution Center",
    plannedQuantity: 200,
    completedQuantity: 60,
    scrapQuantity: 0,
    plannedStartUtc: "2026-03-05T06:00:00Z",
    plannedEndUtc: "2026-03-07T18:00:00Z",
    dueDateUtc: "2026-03-12T18:00:00Z",
    priority: SchedulePriority.Urgent,
    status: ScheduleJobStatus.Blocked,
    materialReadinessStatus: MaterialReadinessStatus.Shortage,
    createdAtUtc: "2026-02-27T11:00:00Z"
  },
  {
    id: "sj-4",
    schedulePlanId: "sp-2",
    productionOrderId: "po-2",
    productId: "prod-2",
    warehouseId: "wh-1",
    jobNumber: "SJ-2026-004",
    jobName: "7005 Aluminum Tube Extrusion",
    productName: "7005 Aluminum Extrusion Tube",
    productSku: "ALU-7005-TUBE",
    warehouseName: "Plant A Warehouse",
    plannedQuantity: 400,
    completedQuantity: 0,
    scrapQuantity: 0,
    plannedStartUtc: "2026-03-10T06:00:00Z",
    plannedEndUtc: "2026-03-14T18:00:00Z",
    dueDateUtc: "2026-03-14T18:00:00Z",
    priority: SchedulePriority.Normal,
    status: ScheduleJobStatus.Scheduled,
    materialReadinessStatus: MaterialReadinessStatus.PartiallyReady,
    createdAtUtc: "2026-03-05T09:30:00Z"
  },
  {
    id: "sj-5",
    schedulePlanId: "sp-2",
    productionOrderId: "po-5",
    productId: "prod-1",
    warehouseId: "wh-3",
    jobNumber: "SJ-2026-005",
    jobName: "6061 Bar — Plant B Run",
    productName: "6061 Aluminum Extrusion Bar",
    productSku: "ALU-6061-BAR",
    warehouseName: "Plant B Warehouse",
    plannedQuantity: 800,
    completedQuantity: 0,
    scrapQuantity: 0,
    plannedStartUtc: "2026-03-15T06:00:00Z",
    plannedEndUtc: "2026-03-20T18:00:00Z",
    dueDateUtc: "2026-03-20T18:00:00Z",
    priority: SchedulePriority.Low,
    status: ScheduleJobStatus.Unscheduled,
    materialReadinessStatus: MaterialReadinessStatus.NotChecked,
    createdAtUtc: "2026-03-05T10:00:00Z"
  }
];

/* ── Plan Detail (sp-1) ─────────────────────────── */

export const schedulePlanDetailsMock: Record<string, SchedulePlanDetail> = {
  "sp-1": {
    ...schedulePlansMock[0],
    totalJobs: 3,
    totalOperations: 5,
    totalExceptions: 2,
    totalRevisions: 2,
    jobs: [
      { id: "sj-1", jobNumber: "SJ-2026-001", jobName: "6061 Aluminum Extrusion Run", plannedQuantity: 1200, status: ScheduleJobStatus.Running, dueDateUtc: "2026-03-08T18:00:00Z" },
      { id: "sj-2", jobNumber: "SJ-2026-002", jobName: "Hydraulic Seal Kit Assembly", plannedQuantity: 500, status: ScheduleJobStatus.Completed, dueDateUtc: "2026-03-06T18:00:00Z" },
      { id: "sj-3", jobNumber: "SJ-2026-003", jobName: "Adhesive Tape Roll Production", plannedQuantity: 200, status: ScheduleJobStatus.Blocked, dueDateUtc: "2026-03-12T18:00:00Z" }
    ]
  }
};

/* ── Job Detail (sj-1) ──────────────────────────── */

export const scheduleJobDetailsMock: Record<string, ScheduleJobDetail> = {
  "sj-1": {
    ...scheduleJobsMock[0],
    totalOperations: 2,
    totalExceptions: 1,
    totalMaterialChecks: 1,
    operations: [
      { id: "sop-1", sequenceNo: 1, operationCode: "EXT-01", operationName: "Hot Extrusion", plannedStartUtc: "2026-03-01T06:00:00Z", plannedEndUtc: "2026-03-04T18:00:00Z", status: ScheduleOperationStatus.Running },
      { id: "sop-2", sequenceNo: 2, operationCode: "AGE-01", operationName: "Aging & Heat Treatment", plannedStartUtc: "2026-03-05T06:00:00Z", plannedEndUtc: "2026-03-05T18:00:00Z", status: ScheduleOperationStatus.Pending }
    ],
    materialChecks: [
      { id: "mc-1", scheduleJobId: "sj-1", productionOrderId: "po-1", materialProductId: "mat-1", materialProductName: "6061 Aluminum Billet", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", requiredQuantity: 1320, availableQuantity: 1400, reservedQuantity: 1320, shortageQuantity: 0, status: MaterialReadinessStatus.Ready, checkedAtUtc: "2026-02-28T15:00:00Z" }
    ]
  }
};

/* ── Exceptions ──────────────────────────────────── */

export const scheduleExceptionsMock: ScheduleException[] = [
  {
    id: "se-1",
    schedulePlanId: "sp-1",
    scheduleJobId: "sj-3",
    exceptionType: ScheduleExceptionType.MaterialShortage,
    severity: ScheduleExceptionSeverity.High,
    title: "Adhesive resin shortage",
    description: "Supplier delayed shipment of VHB adhesive resin. Expected 2-day delay.",
    detectedAtUtc: "2026-03-05T09:00:00Z",
    assignedTo: "Procurement Team",
    status: ScheduleExceptionStatus.Investigating,
    resolutionNotes: undefined
  },
  {
    id: "se-2",
    schedulePlanId: "sp-1",
    scheduleJobId: "sj-1",
    scheduleOperationId: "sop-1",
    exceptionType: ScheduleExceptionType.DueDateRisk,
    severity: ScheduleExceptionSeverity.Medium,
    title: "Extrusion job nearing due date",
    description: "SJ-2026-001 is at 65% completion with 3 days remaining. May require overtime.",
    detectedAtUtc: "2026-03-05T14:00:00Z",
    status: ScheduleExceptionStatus.Open
  },
  {
    id: "se-3",
    schedulePlanId: "sp-3",
    exceptionType: ScheduleExceptionType.MachineBreakdown,
    severity: ScheduleExceptionSeverity.Critical,
    title: "EP-3000 hydraulic failure",
    description: "Main hydraulic pump failed on Extrusion Press EP-3000. Emergency maintenance completed.",
    detectedAtUtc: "2026-02-25T08:00:00Z",
    resolvedAtUtc: "2026-02-25T16:00:00Z",
    assignedTo: "Maintenance",
    status: ScheduleExceptionStatus.Resolved,
    resolutionNotes: "Replaced hydraulic pump assembly. Machine back online."
  }
];

/* ── Shifts ──────────────────────────────────────── */

export const shiftsMock: Shift[] = [
  { id: "sh-1", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", shiftCode: "DAY", shiftName: "Day Shift", startTime: "06:00", endTime: "14:00", crossesMidnight: false, isActive: true, capacityMinutes: 450, breakMinutes: 30 },
  { id: "sh-2", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", shiftCode: "EVE", shiftName: "Evening Shift", startTime: "14:00", endTime: "22:00", crossesMidnight: false, isActive: true, capacityMinutes: 450, breakMinutes: 30 },
  { id: "sh-3", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", shiftCode: "NGT", shiftName: "Night Shift", startTime: "22:00", endTime: "06:00", crossesMidnight: true, isActive: false, capacityMinutes: 450, breakMinutes: 30 },
  { id: "sh-4", warehouseId: "wh-1", workCenterId: "wc-1", warehouseName: "Plant A Warehouse", workCenterName: "Extrusion Line A", shiftCode: "EXT-DAY", shiftName: "Extrusion Day", startTime: "06:00", endTime: "18:00", crossesMidnight: false, isActive: true, capacityMinutes: 690, breakMinutes: 30 }
];

/* ── Capacity Snapshots ──────────────────────────── */

export const capacitySnapshotsMock: ResourceCapacitySnapshot[] = [
  { id: "cs-1", resourceId: "wc-1", resourceType: ResourceType.WorkCenter, resourceName: "Extrusion Line A", snapshotDateUtc: "2026-03-07T00:00:00Z", shiftId: "sh-1", shiftName: "Day Shift", totalCapacityMinutes: 450, reservedMinutes: 420, availableMinutes: 30, overtimeMinutes: 0, isOverloaded: false, isBottleneck: true },
  { id: "cs-2", resourceId: "wc-1", resourceType: ResourceType.WorkCenter, resourceName: "Extrusion Line A", snapshotDateUtc: "2026-03-07T00:00:00Z", shiftId: "sh-2", shiftName: "Evening Shift", totalCapacityMinutes: 450, reservedMinutes: 300, availableMinutes: 150, overtimeMinutes: 0, isOverloaded: false, isBottleneck: false },
  { id: "cs-3", resourceId: "mc-1", resourceType: ResourceType.Machine, resourceName: "Extrusion Press EP-3000", snapshotDateUtc: "2026-03-07T00:00:00Z", shiftId: "sh-1", shiftName: "Day Shift", totalCapacityMinutes: 450, reservedMinutes: 450, availableMinutes: 0, overtimeMinutes: 30, isOverloaded: true, isBottleneck: true },
  { id: "cs-4", resourceId: "wc-2", resourceType: ResourceType.WorkCenter, resourceName: "Assembly Bay B", snapshotDateUtc: "2026-03-07T00:00:00Z", shiftId: "sh-1", shiftName: "Day Shift", totalCapacityMinutes: 450, reservedMinutes: 180, availableMinutes: 270, overtimeMinutes: 0, isOverloaded: false, isBottleneck: false }
];
