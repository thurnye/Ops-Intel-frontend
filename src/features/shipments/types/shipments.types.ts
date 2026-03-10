/* ── Enums ────────────────────────────────────────── */

export enum ShipmentType {
  Outbound = 1,
  Transfer = 2,
  Return = 3,
  DropShip = 4
}

export enum ShipmentStatus {
  Draft = 1,
  AwaitingAllocation = 2,
  Allocated = 3,
  Picking = 4,
  Picked = 5,
  Packing = 6,
  Packed = 7,
  ReadyToDispatch = 8,
  Dispatched = 9,
  InTransit = 10,
  OutForDelivery = 11,
  Delivered = 12,
  DeliveryFailed = 13,
  Returned = 14,
  Cancelled = 15
}

export enum ShipmentPriority {
  Low = 1,
  Normal = 2,
  High = 3,
  Urgent = 4
}

export enum ShipmentItemStatus {
  Pending = 1,
  Allocated = 2,
  Picked = 3,
  Packed = 4,
  Shipped = 5,
  Delivered = 6,
  Returned = 7,
  Cancelled = 8
}

export enum PackageStatus {
  Draft = 1,
  Packed = 2,
  LabelGenerated = 3,
  Dispatched = 4,
  InTransit = 5,
  Delivered = 6,
  Damaged = 7,
  Lost = 8
}

export enum ShipmentDocumentType {
  PackingSlip = 1,
  BillOfLading = 2,
  ShippingLabel = 3,
  Invoice = 4,
  ProofOfDelivery = 5,
  CustomsDocument = 6,
  Other = 7
}

export enum ShipmentExceptionType {
  Delay = 1,
  Damage = 2,
  Lost = 3,
  AddressIssue = 4,
  CustomerUnavailable = 5,
  CustomsHold = 6,
  Weather = 7,
  Other = 8
}

export enum ShipmentChargeType {
  Freight = 1,
  FuelSurcharge = 2,
  Insurance = 3,
  Handling = 4,
  Customs = 5,
  Tax = 6,
  Other = 7
}

export enum DeliveryRunStatus {
  Draft = 1,
  Planned = 2,
  Dispatched = 3,
  InProgress = 4,
  Completed = 5,
  Cancelled = 6
}

export enum DockAppointmentStatus {
  Scheduled = 1,
  CheckedIn = 2,
  Loading = 3,
  Completed = 4,
  Missed = 5,
  Cancelled = 6
}

export enum InsuranceStatus {
  Pending = 1,
  Active = 2,
  Expired = 3,
  Claimed = 4,
  Cancelled = 5
}

export enum ReturnShipmentStatus {
  Requested = 1,
  Approved = 2,
  InTransit = 3,
  Received = 4,
  Inspected = 5,
  Restocked = 6,
  Rejected = 7,
  Closed = 8
}

export enum CustomsDocumentType {
  CommercialInvoice = 1,
  CertificateOfOrigin = 2,
  CustomsDeclaration = 3,
  ExportDeclaration = 4,
  ImportPermit = 5,
  PackingList = 6,
  Other = 7
}

/* ── Address ─────────────────────────────────────── */

export type ShipmentAddress = {
  id: string;
  addressType: string;
  contactName: string;
  companyName?: string;
  phone?: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
};

/* ── Shipment Item ───────────────────────────────── */

export type ShipmentItem = {
  id: string;
  orderItemId?: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  unitOfMeasureId: string;
  unitOfMeasureName: string;
  inventoryStockId?: string;
  productionOrderId?: string;
  lineNumber: string;
  orderedQuantity: number;
  allocatedQuantity: number;
  pickedQuantity: number;
  packedQuantity: number;
  shippedQuantity: number;
  deliveredQuantity: number;
  returnedQuantity: number;
  unitWeight: number;
  unitVolume: number;
  lotNumber?: string;
  serialNumber?: string;
  expiryDateUtc?: string;
  status: ShipmentItemStatus;
  notes?: string;
};

/* ── Package ─────────────────────────────────────── */

export type ShipmentPackageItem = {
  id: string;
  shipmentItemId: string;
  lineNumber: string;
  productId: string;
  productName: string;
  quantity: number;
};

export type ShipmentPackage = {
  id: string;
  packageNumber: string;
  trackingNumber?: string;
  packageType: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  declaredValue: number;
  requiresSpecialHandling: boolean;
  isFragile: boolean;
  labelUrl?: string;
  barcode?: string;
  status: PackageStatus;
  packageItems: ShipmentPackageItem[];
};

/* ── Tracking Event ──────────────────────────────── */

export type ShipmentTrackingEvent = {
  id: string;
  eventCode: string;
  eventName: string;
  description?: string;
  eventTimeUtc: string;
  locationName?: string;
  city?: string;
  stateOrProvince?: string;
  country?: string;
  carrierStatusCode?: string;
  source: string;
  isCustomerVisible: boolean;
};

/* ── Document ────────────────────────────────────── */

export type ShipmentDocument = {
  id: string;
  documentType: ShipmentDocumentType;
  fileName: string;
  fileUrl: string;
  contentType?: string;
  fileSizeBytes: number;
  isCustomerVisible: boolean;
  notes?: string;
};

/* ── Charge ───────────────────────────────────────── */

export type ShipmentCharge = {
  id: string;
  chargeType: ShipmentChargeType;
  description: string;
  amount: number;
  currencyCode: string;
};

/* ── Exception ───────────────────────────────────── */

export type ShipmentException = {
  id: string;
  exceptionType: ShipmentExceptionType;
  title: string;
  description?: string;
  reportedAtUtc: string;
  reportedBy?: string;
  isResolved: boolean;
  resolvedAtUtc?: string;
  resolutionNote?: string;
};

/* ── Insurance ───────────────────────────────────── */

export type ShipmentInsurance = {
  id: string;
  providerName: string;
  policyNumber?: string;
  insuredAmount: number;
  premiumAmount: number;
  currencyCode: string;
  effectiveDateUtc: string;
  expiryDateUtc?: string;
  status: InsuranceStatus;
  notes?: string;
};

/* ── Status History ──────────────────────────────── */

export type ShipmentStatusHistory = {
  id: string;
  fromStatus: ShipmentStatus;
  toStatus: ShipmentStatus;
  changedAtUtc: string;
  changedBy: string;
  reason?: string;
};

/* ── Return Shipment ─────────────────────────────── */

export type ReturnShipmentItem = {
  id: string;
  shipmentItemId: string;
  productId: string;
  productName: string;
  returnedQuantity: number;
  returnCondition?: string;
  inspectionResult?: string;
  notes?: string;
};

export type ReturnShipment = {
  id: string;
  returnShipmentNumber: string;
  shipmentId: string;
  orderId?: string;
  originAddressId: string;
  destinationAddressId: string;
  carrierId?: string;
  carrierName?: string;
  carrierServiceId?: string;
  carrierServiceName?: string;
  trackingNumber?: string;
  reasonCode: string;
  reasonDescription?: string;
  status: ReturnShipmentStatus;
  requestedAtUtc: string;
  receivedAtUtc?: string;
  notes?: string;
  items: ReturnShipmentItem[];
};

/* ── List Item (lightweight) ─────────────────────── */

export type ShipmentListItem = {
  id: string;
  shipmentNumber: string;
  orderId?: string;
  orderNumber?: string;
  warehouseName?: string;
  carrierName?: string;
  type: ShipmentType;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  trackingNumber?: string;
  plannedShipDateUtc?: string;
  plannedDeliveryDateUtc?: string;
  totalWeight: number;
  totalPackages: number;
  isCrossBorder: boolean;
  isPartialShipment: boolean;
  createdAtUtc: string;
};

/* ── Full Shipment Response ──────────────────────── */

export type Shipment = {
  id: string;
  shipmentNumber: string;
  orderId?: string;
  orderNumber?: string;
  warehouseId: string;
  warehouseName: string;
  carrierId?: string;
  carrierName?: string;
  carrierServiceId?: string;
  carrierServiceName?: string;
  originAddress: ShipmentAddress;
  destinationAddress: ShipmentAddress;
  type: ShipmentType;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  customerReference?: string;
  externalReference?: string;
  trackingNumber?: string;
  masterTrackingNumber?: string;
  plannedShipDateUtc?: string;
  plannedDeliveryDateUtc?: string;
  actualShipDateUtc?: string;
  actualDeliveryDateUtc?: string;
  scheduledPickupStartUtc?: string;
  scheduledPickupEndUtc?: string;
  totalWeight: number;
  totalVolume: number;
  totalPackages: number;
  freightCost: number;
  insuranceCost: number;
  otherCharges: number;
  totalShippingCost: number;
  currencyCode: string;
  shippingTerms?: string;
  incoterm?: string;
  isPartialShipment: boolean;
  requiresSignature: boolean;
  isFragile: boolean;
  isHazardous: boolean;
  isTemperatureControlled: boolean;
  isInsured: boolean;
  isCrossBorder: boolean;
  notes?: string;
  internalNotes?: string;
  items: ShipmentItem[];
  packages: ShipmentPackage[];
  trackingEvents: ShipmentTrackingEvent[];
  documents: ShipmentDocument[];
  charges: ShipmentCharge[];
  exceptions: ShipmentException[];
  insurances: ShipmentInsurance[];
  statusHistories: ShipmentStatusHistory[];
  returnShipments: ReturnShipment[];
  createdAtUtc: string;
  createdBy?: string;
  updatedAtUtc?: string;
  updatedBy?: string;
};

/* ── Summary ─────────────────────────────────────── */

export type ShipmentSummary = {
  totalShipments: number;
  draftShipments: number;
  readyToDispatchShipments: number;
  inTransitShipments: number;
  deliveredShipments: number;
  failedShipments: number;
  returnedShipments: number;
  totalFreightCost: number;
  totalShippingCost: number;
  totalPackages: number;
  totalWeight: number;
};

/* ── Filters ─────────────────────────────────────── */

export type ShipmentFilters = {
  query: string;
  status: ShipmentStatus | "all";
  type: ShipmentType | "all";
  priority: ShipmentPriority | "all";
};
