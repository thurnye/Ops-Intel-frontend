/* ── Enums ─────────────────────────────────────────── */

export enum ProductionOrderStatus {
  Draft = 1,
  Planned = 2,
  Released = 3,
  InProgress = 4,
  Paused = 5,
  Completed = 6,
  Closed = 7,
  Cancelled = 8
}

export enum ProductionPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4
}

export enum ProductionSourceType {
  Manual = 1,
  SalesOrder = 2,
  Replenishment = 3,
  Forecast = 4,
  TransferDemand = 5
}

export enum ExecutionStatus {
  Pending = 1,
  Ready = 2,
  Running = 3,
  Paused = 4,
  Completed = 5,
  Cancelled = 6
}

export enum MachineStatus {
  Idle = 1,
  Running = 2,
  Down = 3,
  Maintenance = 4,
  Retired = 5
}

export enum ScrapReasonType {
  Defect = 1,
  Damage = 2,
  Overproduction = 3,
  SetupLoss = 4,
  Expired = 5,
  Contamination = 6,
  Other = 7
}

export enum DowntimeReasonType {
  MachineBreakdown = 1,
  PowerFailure = 2,
  MaterialShortage = 3,
  Changeover = 4,
  Maintenance = 5,
  QualityIssue = 6,
  OperatorUnavailable = 7,
  Other = 8
}

export enum QualityCheckType {
  Incoming = 1,
  InProcess = 2,
  Final = 3,
  ReworkVerification = 4
}

export enum QualityCheckStatus {
  Pending = 1,
  Passed = 2,
  Failed = 3,
  ConditionalPass = 4
}

/* ── Work Center & Machine ────────────────────────── */

export type WorkCenter = {
  id: string;
  code: string;
  name: string;
  description?: string;
  warehouseId: string;
  warehouseName?: string;
  capacityPerDay: number;
  availableOperators: number;
  isActive: boolean;
};

export type Machine = {
  id: string;
  machineCode: string;
  name: string;
  workCenterId: string;
  workCenterName?: string;
  model?: string;
  manufacturer?: string;
  serialNumber?: string;
  hourlyRunningCost: number;
  status: MachineStatus;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  isActive: boolean;
};

/* ── BOM ──────────────────────────────────────────── */

export type BillOfMaterialItem = {
  id: string;
  billOfMaterialId: string;
  materialProductId: string;
  materialProductName?: string;
  materialProductSku?: string;
  quantityRequired: number;
  unitOfMeasureName?: string;
  scrapFactorPercent: number;
  yieldFactorPercent: number;
  isOptional: boolean;
  isBackflush: boolean;
  sequence: number;
  notes?: string;
};

export type BillOfMaterialSummary = {
  id: string;
  bomCode: string;
  name: string;
  productId: string;
  productName?: string;
  productSku?: string;
  baseQuantity: number;
  unitOfMeasureName?: string;
  version: number;
  isActive: boolean;
  isDefault: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
};

/* ── Routing ──────────────────────────────────────── */

export type RoutingStep = {
  id: string;
  routingId: string;
  sequence: number;
  operationCode: string;
  operationName: string;
  workCenterId: string;
  workCenterName?: string;
  setupTimeMinutes: number;
  runTimeMinutesPerUnit: number;
  queueTimeMinutes: number;
  waitTimeMinutes: number;
  moveTimeMinutes: number;
  requiredOperators: number;
  isOutsourced: boolean;
  isQualityCheckpointRequired: boolean;
  instructions?: string;
  notes?: string;
};

export type RoutingSummary = {
  id: string;
  routingCode: string;
  name: string;
  productId: string;
  productName?: string;
  productSku?: string;
  version: number;
  isActive: boolean;
  isDefault: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
};

/* ── Sub-records ──────────────────────────────────── */

export type ProductionMaterialConsumption = {
  id: string;
  productionMaterialIssueId: string;
  productionExecutionId?: string;
  consumedQuantity: number;
  consumptionDate: string;
  notes?: string;
};

export type ProductionMaterialIssue = {
  id: string;
  productionOrderId: string;
  materialProductName?: string;
  materialProductSku?: string;
  warehouseName?: string;
  plannedQuantity: number;
  issuedQuantity: number;
  returnedQuantity: number;
  unitOfMeasureName?: string;
  batchNumber?: string;
  lotNumber?: string;
  issueDate: string;
  notes?: string;
  consumptions: ProductionMaterialConsumption[];
};

export type ProductionOutput = {
  id: string;
  productionOrderId: string;
  productName?: string;
  productSku?: string;
  warehouseName?: string;
  quantityProduced: number;
  unitOfMeasureName?: string;
  batchNumber?: string;
  lotNumber?: string;
  outputDate: string;
  isFinalOutput: boolean;
  notes?: string;
};

export type ProductionScrap = {
  id: string;
  productionOrderId: string;
  productionExecutionId?: string;
  productName?: string;
  scrapQuantity: number;
  unitOfMeasureName?: string;
  reason: ScrapReasonType;
  reasonDescription?: string;
  scrapDate: string;
  isReworkable: boolean;
  notes?: string;
};

export type ProductionDowntime = {
  id: string;
  productionExecutionId: string;
  reason: DowntimeReasonType;
  reasonDescription?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isPlanned: boolean;
  notes?: string;
};

export type ProductionLaborLog = {
  id: string;
  productionExecutionId: string;
  userName?: string;
  hoursWorked: number;
  hourlyRate: number;
  workDate: string;
  notes?: string;
};

export type ProductionQualityCheck = {
  id: string;
  productionOrderId: string;
  productionExecutionId?: string;
  checkType: QualityCheckType;
  status: QualityCheckStatus;
  checkDate: string;
  checkedByUserName?: string;
  referenceStandard?: string;
  findings?: string;
  correctiveAction?: string;
  requiresRework: boolean;
  notes?: string;
};

/* ── Execution ────────────────────────────────────── */

export type ProductionExecutionSummary = {
  id: string;
  productionOrderId: string;
  productionOrderNumber?: string;
  workCenterId: string;
  workCenterName?: string;
  machineId?: string;
  machineName?: string;
  plannedQuantity: number;
  completedQuantity: number;
  scrapQuantity: number;
  plannedStartDate: string;
  plannedEndDate: string;
  status: ExecutionStatus;
};

export type ProductionExecution = ProductionExecutionSummary & {
  routingStepSequence?: number;
  operationCode?: string;
  operationName?: string;
  machineCode?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  actualSetupTimeMinutes: number;
  actualRunTimeMinutes: number;
  actualDowntimeMinutes: number;
  remarks?: string;
  materialConsumptions: ProductionMaterialConsumption[];
  laborLogs: ProductionLaborLog[];
  downtimes: ProductionDowntime[];
  scraps: ProductionScrap[];
  qualityChecks: ProductionQualityCheck[];
};

/* ── Production Order ─────────────────────────────── */

export type ProductionOrderSummary = {
  id: string;
  productionOrderNumber: string;
  productId: string;
  productName?: string;
  productSku?: string;
  plannedQuantity: number;
  producedQuantity: number;
  remainingQuantity: number;
  unitOfMeasureName?: string;
  warehouseName?: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: ProductionOrderStatus;
  priority: ProductionPriority;
  isReleased: boolean;
  isClosed: boolean;
  createdAtUtc: string;
};

export type ProductionOrder = ProductionOrderSummary & {
  scrapQuantity: number;
  unitOfMeasureId: string;
  billOfMaterialCode?: string;
  billOfMaterialName?: string;
  routingCode?: string;
  routingName?: string;
  warehouseId: string;
  actualStartDate?: string;
  actualEndDate?: string;
  sourceType: ProductionSourceType;
  sourceReferenceId?: string;
  batchNumber?: string;
  lotNumber?: string;
  notes?: string;
  estimatedMaterialCost: number;
  estimatedLaborCost: number;
  estimatedOverheadCost: number;
  actualMaterialCost: number;
  actualLaborCost: number;
  actualOverheadCost: number;
  executions: ProductionExecution[];
  materialIssues: ProductionMaterialIssue[];
  outputs: ProductionOutput[];
  scraps: ProductionScrap[];
  qualityChecks: ProductionQualityCheck[];
};

/* ── Filters ──────────────────────────────────────── */

export type ProductionFilters = {
  query: string;
  status: ProductionOrderStatus | "all";
  priority: ProductionPriority | "all";
};
