import {
  ShipmentType,
  ShipmentStatus,
  ShipmentPriority,
  ShipmentItemStatus,
  PackageStatus,
  ShipmentDocumentType,
  ShipmentExceptionType,
  ShipmentChargeType,
  InsuranceStatus,
  ReturnShipmentStatus
} from "@features/shipments/types/shipments.types";

/* ── Shipment status ─────────────────────────────── */

export function shipmentStatusLabel(s: ShipmentStatus): string {
  const m: Record<ShipmentStatus, string> = {
    [ShipmentStatus.Draft]: "Draft",
    [ShipmentStatus.AwaitingAllocation]: "Awaiting Allocation",
    [ShipmentStatus.Allocated]: "Allocated",
    [ShipmentStatus.Picking]: "Picking",
    [ShipmentStatus.Picked]: "Picked",
    [ShipmentStatus.Packing]: "Packing",
    [ShipmentStatus.Packed]: "Packed",
    [ShipmentStatus.ReadyToDispatch]: "Ready to Dispatch",
    [ShipmentStatus.Dispatched]: "Dispatched",
    [ShipmentStatus.InTransit]: "In Transit",
    [ShipmentStatus.OutForDelivery]: "Out for Delivery",
    [ShipmentStatus.Delivered]: "Delivered",
    [ShipmentStatus.DeliveryFailed]: "Delivery Failed",
    [ShipmentStatus.Returned]: "Returned",
    [ShipmentStatus.Cancelled]: "Cancelled"
  };
  return m[s] ?? "Unknown";
}

export function shipmentStatusColor(s: ShipmentStatus): string {
  switch (s) {
    case ShipmentStatus.Draft: return "#94a3b8";
    case ShipmentStatus.AwaitingAllocation: return "#8b5cf6";
    case ShipmentStatus.Allocated: return "#06b6d4";
    case ShipmentStatus.Picking: return "#f59e0b";
    case ShipmentStatus.Picked: return "#eab308";
    case ShipmentStatus.Packing: return "#f97316";
    case ShipmentStatus.Packed: return "#14b8a6";
    case ShipmentStatus.ReadyToDispatch: return "#3b82f6";
    case ShipmentStatus.Dispatched: return "#6366f1";
    case ShipmentStatus.InTransit: return "#2563eb";
    case ShipmentStatus.OutForDelivery: return "#8b5cf6";
    case ShipmentStatus.Delivered: return "#10b981";
    case ShipmentStatus.DeliveryFailed: return "#ef4444";
    case ShipmentStatus.Returned: return "#f97316";
    case ShipmentStatus.Cancelled: return "#64748b";
    default: return "#94a3b8";
  }
}

/* ── Shipment type ───────────────────────────────── */

export function shipmentTypeLabel(t: ShipmentType): string {
  const m: Record<ShipmentType, string> = {
    [ShipmentType.Outbound]: "Outbound",
    [ShipmentType.Transfer]: "Transfer",
    [ShipmentType.Return]: "Return",
    [ShipmentType.DropShip]: "Drop Ship"
  };
  return m[t] ?? "Unknown";
}

/* ── Priority ────────────────────────────────────── */

export function shipmentPriorityLabel(p: ShipmentPriority): string {
  const m: Record<ShipmentPriority, string> = {
    [ShipmentPriority.Low]: "Low",
    [ShipmentPriority.Normal]: "Normal",
    [ShipmentPriority.High]: "High",
    [ShipmentPriority.Urgent]: "Urgent"
  };
  return m[p] ?? "Normal";
}

export function shipmentPriorityColor(p: ShipmentPriority): string {
  switch (p) {
    case ShipmentPriority.Low: return "#94a3b8";
    case ShipmentPriority.Normal: return "#3b82f6";
    case ShipmentPriority.High: return "#f59e0b";
    case ShipmentPriority.Urgent: return "#ef4444";
    default: return "#94a3b8";
  }
}

/* ── Item status ─────────────────────────────────── */

export function itemStatusLabel(s: ShipmentItemStatus): string {
  const m: Record<ShipmentItemStatus, string> = {
    [ShipmentItemStatus.Pending]: "Pending",
    [ShipmentItemStatus.Allocated]: "Allocated",
    [ShipmentItemStatus.Picked]: "Picked",
    [ShipmentItemStatus.Packed]: "Packed",
    [ShipmentItemStatus.Shipped]: "Shipped",
    [ShipmentItemStatus.Delivered]: "Delivered",
    [ShipmentItemStatus.Returned]: "Returned",
    [ShipmentItemStatus.Cancelled]: "Cancelled"
  };
  return m[s] ?? "Unknown";
}

export function itemStatusColor(s: ShipmentItemStatus): string {
  switch (s) {
    case ShipmentItemStatus.Pending: return "#94a3b8";
    case ShipmentItemStatus.Allocated: return "#06b6d4";
    case ShipmentItemStatus.Picked: return "#eab308";
    case ShipmentItemStatus.Packed: return "#14b8a6";
    case ShipmentItemStatus.Shipped: return "#3b82f6";
    case ShipmentItemStatus.Delivered: return "#10b981";
    case ShipmentItemStatus.Returned: return "#f97316";
    case ShipmentItemStatus.Cancelled: return "#64748b";
    default: return "#94a3b8";
  }
}

/* ── Package status ──────────────────────────────── */

export function packageStatusLabel(s: PackageStatus): string {
  const m: Record<PackageStatus, string> = {
    [PackageStatus.Draft]: "Draft",
    [PackageStatus.Packed]: "Packed",
    [PackageStatus.LabelGenerated]: "Label Generated",
    [PackageStatus.Dispatched]: "Dispatched",
    [PackageStatus.InTransit]: "In Transit",
    [PackageStatus.Delivered]: "Delivered",
    [PackageStatus.Damaged]: "Damaged",
    [PackageStatus.Lost]: "Lost"
  };
  return m[s] ?? "Unknown";
}

export function packageStatusColor(s: PackageStatus): string {
  switch (s) {
    case PackageStatus.Draft: return "#94a3b8";
    case PackageStatus.Packed: return "#14b8a6";
    case PackageStatus.LabelGenerated: return "#8b5cf6";
    case PackageStatus.Dispatched: return "#6366f1";
    case PackageStatus.InTransit: return "#3b82f6";
    case PackageStatus.Delivered: return "#10b981";
    case PackageStatus.Damaged: return "#ef4444";
    case PackageStatus.Lost: return "#dc2626";
    default: return "#94a3b8";
  }
}

/* ── Document type ───────────────────────────────── */

export function documentTypeLabel(t: ShipmentDocumentType): string {
  const m: Record<ShipmentDocumentType, string> = {
    [ShipmentDocumentType.PackingSlip]: "Packing Slip",
    [ShipmentDocumentType.BillOfLading]: "Bill of Lading",
    [ShipmentDocumentType.ShippingLabel]: "Shipping Label",
    [ShipmentDocumentType.Invoice]: "Invoice",
    [ShipmentDocumentType.ProofOfDelivery]: "Proof of Delivery",
    [ShipmentDocumentType.CustomsDocument]: "Customs Document",
    [ShipmentDocumentType.Other]: "Other"
  };
  return m[t] ?? "Unknown";
}

/* ── Exception type ──────────────────────────────── */

export function exceptionTypeLabel(t: ShipmentExceptionType): string {
  const m: Record<ShipmentExceptionType, string> = {
    [ShipmentExceptionType.Delay]: "Delay",
    [ShipmentExceptionType.Damage]: "Damage",
    [ShipmentExceptionType.Lost]: "Lost",
    [ShipmentExceptionType.AddressIssue]: "Address Issue",
    [ShipmentExceptionType.CustomerUnavailable]: "Customer Unavailable",
    [ShipmentExceptionType.CustomsHold]: "Customs Hold",
    [ShipmentExceptionType.Weather]: "Weather",
    [ShipmentExceptionType.Other]: "Other"
  };
  return m[t] ?? "Unknown";
}

/* ── Charge type ─────────────────────────────────── */

export function chargeTypeLabel(t: ShipmentChargeType): string {
  const m: Record<ShipmentChargeType, string> = {
    [ShipmentChargeType.Freight]: "Freight",
    [ShipmentChargeType.FuelSurcharge]: "Fuel Surcharge",
    [ShipmentChargeType.Insurance]: "Insurance",
    [ShipmentChargeType.Handling]: "Handling",
    [ShipmentChargeType.Customs]: "Customs",
    [ShipmentChargeType.Tax]: "Tax",
    [ShipmentChargeType.Other]: "Other"
  };
  return m[t] ?? "Unknown";
}

/* ── Insurance status ────────────────────────────── */

export function insuranceStatusLabel(s: InsuranceStatus): string {
  const m: Record<InsuranceStatus, string> = {
    [InsuranceStatus.Pending]: "Pending",
    [InsuranceStatus.Active]: "Active",
    [InsuranceStatus.Expired]: "Expired",
    [InsuranceStatus.Claimed]: "Claimed",
    [InsuranceStatus.Cancelled]: "Cancelled"
  };
  return m[s] ?? "Unknown";
}

/* ── Return shipment status ──────────────────────── */

export function returnStatusLabel(s: ReturnShipmentStatus): string {
  const m: Record<ReturnShipmentStatus, string> = {
    [ReturnShipmentStatus.Requested]: "Requested",
    [ReturnShipmentStatus.Approved]: "Approved",
    [ReturnShipmentStatus.InTransit]: "In Transit",
    [ReturnShipmentStatus.Received]: "Received",
    [ReturnShipmentStatus.Inspected]: "Inspected",
    [ReturnShipmentStatus.Restocked]: "Restocked",
    [ReturnShipmentStatus.Rejected]: "Rejected",
    [ReturnShipmentStatus.Closed]: "Closed"
  };
  return m[s] ?? "Unknown";
}

export function returnStatusColor(s: ReturnShipmentStatus): string {
  switch (s) {
    case ReturnShipmentStatus.Requested: return "#f59e0b";
    case ReturnShipmentStatus.Approved: return "#3b82f6";
    case ReturnShipmentStatus.InTransit: return "#6366f1";
    case ReturnShipmentStatus.Received: return "#14b8a6";
    case ReturnShipmentStatus.Inspected: return "#8b5cf6";
    case ReturnShipmentStatus.Restocked: return "#10b981";
    case ReturnShipmentStatus.Rejected: return "#ef4444";
    case ReturnShipmentStatus.Closed: return "#64748b";
    default: return "#94a3b8";
  }
}

/* ── Helpers ──────────────────────────────────────── */

export function formatCurrency(value: number, currency = "CAD"): string {
  return value.toLocaleString("en-US", { style: "currency", currency });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatWeight(kg: number): string {
  return `${kg.toLocaleString("en-US", { maximumFractionDigits: 2 })} kg`;
}
