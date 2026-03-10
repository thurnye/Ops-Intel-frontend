import {
  ProductionOrderStatus,
  ProductionPriority,
  ProductionSourceType,
  ExecutionStatus,
  ScrapReasonType,
  QualityCheckType,
  QualityCheckStatus,
  type ProductionOrderSummary,
  type ProductionOrder,
  type ProductionExecution,
  type ProductionMaterialIssue,
  type ProductionOutput
} from "@features/production/types/production.types";

/* ── Production order list (summary) ──────────────── */

export const productionOrdersMock: ProductionOrderSummary[] = [
  {
    id: "po-1",
    productionOrderNumber: "PO-2026-001",
    productId: "prod-1",
    productName: "6061 Aluminum Extrusion Bar",
    productSku: "ALU-6061-BAR",
    plannedQuantity: 1200,
    producedQuantity: 780,
    remainingQuantity: 420,
    unitOfMeasureName: "Kilogram",
    warehouseName: "Plant A Warehouse",
    plannedStartDate: "2026-03-01T06:00:00Z",
    plannedEndDate: "2026-03-08T18:00:00Z",
    status: ProductionOrderStatus.InProgress,
    priority: ProductionPriority.High,
    isReleased: true,
    isClosed: false,
    createdAtUtc: "2026-02-28T10:00:00Z"
  },
  {
    id: "po-2",
    productionOrderNumber: "PO-2026-002",
    productId: "prod-2",
    productName: "7005 Aluminum Extrusion Tube",
    productSku: "ALU-7005-TUBE",
    plannedQuantity: 400,
    producedQuantity: 0,
    remainingQuantity: 400,
    unitOfMeasureName: "Meter",
    warehouseName: "Plant A Warehouse",
    plannedStartDate: "2026-03-10T06:00:00Z",
    plannedEndDate: "2026-03-14T18:00:00Z",
    status: ProductionOrderStatus.Planned,
    priority: ProductionPriority.Medium,
    isReleased: false,
    isClosed: false,
    createdAtUtc: "2026-03-02T09:00:00Z"
  },
  {
    id: "po-3",
    productionOrderNumber: "PO-2026-003",
    productId: "prod-3",
    productName: "Hydraulic Cylinder Seal Kit",
    productSku: "HYD-SEAL-KIT",
    plannedQuantity: 500,
    producedQuantity: 500,
    remainingQuantity: 0,
    unitOfMeasureName: "Piece",
    warehouseName: "Plant A Warehouse",
    plannedStartDate: "2026-02-20T06:00:00Z",
    plannedEndDate: "2026-02-28T18:00:00Z",
    status: ProductionOrderStatus.Completed,
    priority: ProductionPriority.Medium,
    isReleased: true,
    isClosed: false,
    createdAtUtc: "2026-02-18T08:00:00Z"
  },
  {
    id: "po-4",
    productionOrderNumber: "PO-2026-004",
    productId: "prod-4",
    productName: "Industrial Adhesive Tape Roll",
    productSku: "ADH-VHB-25",
    plannedQuantity: 200,
    producedQuantity: 60,
    remainingQuantity: 140,
    unitOfMeasureName: "Box",
    warehouseName: "Distribution Center",
    plannedStartDate: "2026-03-05T06:00:00Z",
    plannedEndDate: "2026-03-12T18:00:00Z",
    status: ProductionOrderStatus.Paused,
    priority: ProductionPriority.Urgent,
    isReleased: true,
    isClosed: false,
    createdAtUtc: "2026-03-04T11:00:00Z"
  },
  {
    id: "po-5",
    productionOrderNumber: "PO-2026-005",
    productId: "prod-1",
    productName: "6061 Aluminum Extrusion Bar",
    productSku: "ALU-6061-BAR",
    plannedQuantity: 800,
    producedQuantity: 0,
    remainingQuantity: 800,
    unitOfMeasureName: "Kilogram",
    warehouseName: "Plant B Warehouse",
    plannedStartDate: "2026-03-15T06:00:00Z",
    plannedEndDate: "2026-03-20T18:00:00Z",
    status: ProductionOrderStatus.Draft,
    priority: ProductionPriority.Low,
    isReleased: false,
    isClosed: false,
    createdAtUtc: "2026-03-07T14:00:00Z"
  }
];

/* ── Executions for po-1 ──────────────────────────── */

const executions1: ProductionExecution[] = [
  {
    id: "exec-1",
    productionOrderId: "po-1",
    productionOrderNumber: "PO-2026-001",
    workCenterId: "wc-1",
    workCenterName: "Extrusion Line A",
    machineId: "mc-1",
    machineName: "Extrusion Press EP-3000",
    machineCode: "EP-3000",
    plannedQuantity: 1200,
    completedQuantity: 780,
    scrapQuantity: 15,
    plannedStartDate: "2026-03-01T06:00:00Z",
    plannedEndDate: "2026-03-08T18:00:00Z",
    status: ExecutionStatus.Running,
    routingStepSequence: 1,
    operationCode: "EXT-01",
    operationName: "Hot Extrusion",
    actualStartDate: "2026-03-01T06:30:00Z",
    actualSetupTimeMinutes: 45,
    actualRunTimeMinutes: 2400,
    actualDowntimeMinutes: 90,
    remarks: "Running on schedule",
    materialConsumptions: [],
    laborLogs: [
      { id: "ll-1", productionExecutionId: "exec-1", userName: "Mike Johnson", hoursWorked: 8, hourlyRate: 35, workDate: "2026-03-07T00:00:00Z" }
    ],
    downtimes: [
      { id: "dt-1", productionExecutionId: "exec-1", reason: 4, startTime: "2026-03-05T10:00:00Z", endTime: "2026-03-05T11:30:00Z", durationMinutes: 90, isPlanned: true, notes: "Die changeover for profile adjustment" }
    ],
    scraps: [
      { id: "scr-1", productionOrderId: "po-1", productionExecutionId: "exec-1", productName: "6061 Aluminum Extrusion Bar", scrapQuantity: 15, unitOfMeasureName: "Kilogram", reason: ScrapReasonType.SetupLoss, reasonDescription: "Initial setup waste", scrapDate: "2026-03-01T07:00:00Z", isReworkable: false }
    ],
    qualityChecks: [
      { id: "qc-1", productionOrderId: "po-1", productionExecutionId: "exec-1", checkType: QualityCheckType.InProcess, status: QualityCheckStatus.Passed, checkDate: "2026-03-03T14:00:00Z", checkedByUserName: "Sarah Chen", referenceStandard: "ASTM B221", findings: "Dimensions within tolerance", requiresRework: false }
    ]
  }
];

const materialIssues1: ProductionMaterialIssue[] = [
  { id: "mi-1", productionOrderId: "po-1", materialProductName: "6061 Aluminum Billet", materialProductSku: "ALU-BLT-6061", warehouseName: "Plant A Warehouse", plannedQuantity: 1320, issuedQuantity: 900, returnedQuantity: 0, unitOfMeasureName: "Kilogram", batchNumber: "BLT-2026-044", issueDate: "2026-03-01T05:30:00Z", consumptions: [] }
];

const outputs1: ProductionOutput[] = [
  { id: "out-1", productionOrderId: "po-1", productName: "6061 Aluminum Extrusion Bar", productSku: "ALU-6061-BAR", warehouseName: "Plant A Warehouse", quantityProduced: 780, unitOfMeasureName: "Kilogram", batchNumber: "EXT-2026-001", outputDate: "2026-03-07T16:00:00Z", isFinalOutput: false }
];

/* ── Full detail for po-1 ─────────────────────────── */

export const productionOrderDetailsMock: Record<string, ProductionOrder> = {
  "po-1": {
    ...productionOrdersMock[0],
    scrapQuantity: 15,
    unitOfMeasureId: "uom-2",
    billOfMaterialCode: "BOM-ALU6061-v2",
    billOfMaterialName: "6061 Bar BOM v2",
    routingCode: "RTG-EXT-6061",
    routingName: "6061 Extrusion Routing",
    warehouseId: "wh-1",
    actualStartDate: "2026-03-01T06:30:00Z",
    sourceType: ProductionSourceType.SalesOrder,
    sourceReferenceId: "ord-1",
    batchNumber: "EXT-2026-001",
    notes: "Rush order for Northline EV — high priority",
    estimatedMaterialCost: 5610,
    estimatedLaborCost: 1200,
    estimatedOverheadCost: 800,
    actualMaterialCost: 3825,
    actualLaborCost: 840,
    actualOverheadCost: 520,
    executions: executions1,
    materialIssues: materialIssues1,
    outputs: outputs1,
    scraps: executions1[0].scraps,
    qualityChecks: executions1[0].qualityChecks
  }
};
