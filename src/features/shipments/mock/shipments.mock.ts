import {
  ShipmentType,
  ShipmentStatus,
  ShipmentPriority,
  ShipmentItemStatus,
  PackageStatus,
  ShipmentChargeType,
  ShipmentDocumentType,
  type ShipmentListItem,
  type Shipment
} from "@features/shipments/types/shipments.types";

/* ── Shipment list items ─────────────────────────── */

export const shipmentListMock: ShipmentListItem[] = [
  {
    id: "sh-1",
    shipmentNumber: "SH-2026-001",
    orderId: "ord-1",
    orderNumber: "SO-2026-1024",
    warehouseName: "Plant A Warehouse",
    carrierName: "FedEx Freight",
    type: ShipmentType.Outbound,
    status: ShipmentStatus.InTransit,
    priority: ShipmentPriority.High,
    trackingNumber: "FX-88291034",
    plannedShipDateUtc: "2026-03-06T14:00:00Z",
    plannedDeliveryDateUtc: "2026-03-09T18:00:00Z",
    totalWeight: 1560,
    totalPackages: 4,
    isCrossBorder: false,
    isPartialShipment: false,
    createdAtUtc: "2026-03-05T10:00:00Z"
  },
  {
    id: "sh-2",
    shipmentNumber: "SH-2026-002",
    orderId: "ord-2",
    orderNumber: "SO-2026-1025",
    warehouseName: "Plant A Warehouse",
    carrierName: "R+L Carriers",
    type: ShipmentType.Outbound,
    status: ShipmentStatus.AwaitingAllocation,
    priority: ShipmentPriority.Normal,
    plannedShipDateUtc: "2026-03-11T08:00:00Z",
    plannedDeliveryDateUtc: "2026-03-14T18:00:00Z",
    totalWeight: 320,
    totalPackages: 2,
    isCrossBorder: false,
    isPartialShipment: false,
    createdAtUtc: "2026-03-07T09:00:00Z"
  },
  {
    id: "sh-3",
    shipmentNumber: "SH-2026-003",
    orderId: "ord-3",
    orderNumber: "SO-2026-1026",
    warehouseName: "Distribution Center",
    carrierName: "XPO Logistics",
    type: ShipmentType.Outbound,
    status: ShipmentStatus.Packing,
    priority: ShipmentPriority.Normal,
    trackingNumber: "XPO-44210098",
    plannedShipDateUtc: "2026-03-10T06:00:00Z",
    plannedDeliveryDateUtc: "2026-03-14T18:00:00Z",
    totalWeight: 890,
    totalPackages: 3,
    isCrossBorder: true,
    isPartialShipment: false,
    createdAtUtc: "2026-03-08T11:00:00Z"
  },
  {
    id: "sh-4",
    shipmentNumber: "SH-2026-004",
    orderNumber: "SO-2026-1027",
    warehouseName: "Plant A Warehouse",
    carrierName: "FedEx Freight",
    type: ShipmentType.Outbound,
    status: ShipmentStatus.Delivered,
    priority: ShipmentPriority.Normal,
    trackingNumber: "FX-88291078",
    plannedShipDateUtc: "2026-03-04T10:00:00Z",
    plannedDeliveryDateUtc: "2026-03-06T18:00:00Z",
    totalWeight: 475,
    totalPackages: 2,
    isCrossBorder: false,
    isPartialShipment: false,
    createdAtUtc: "2026-03-03T08:00:00Z"
  },
  {
    id: "sh-5",
    shipmentNumber: "SH-2026-005",
    orderNumber: "SO-2026-1028",
    warehouseName: "Plant B Warehouse",
    carrierName: "Estes Express",
    type: ShipmentType.Outbound,
    status: ShipmentStatus.DeliveryFailed,
    priority: ShipmentPriority.Urgent,
    trackingNumber: "EST-77120045",
    plannedShipDateUtc: "2026-03-05T08:00:00Z",
    plannedDeliveryDateUtc: "2026-03-08T18:00:00Z",
    totalWeight: 210,
    totalPackages: 1,
    isCrossBorder: false,
    isPartialShipment: true,
    createdAtUtc: "2026-03-04T14:00:00Z"
  },
  {
    id: "sh-6",
    shipmentNumber: "SH-2026-006",
    warehouseName: "Plant A Warehouse",
    type: ShipmentType.Transfer,
    status: ShipmentStatus.ReadyToDispatch,
    priority: ShipmentPriority.Low,
    plannedShipDateUtc: "2026-03-12T06:00:00Z",
    plannedDeliveryDateUtc: "2026-03-12T18:00:00Z",
    totalWeight: 2400,
    totalPackages: 6,
    isCrossBorder: false,
    isPartialShipment: false,
    createdAtUtc: "2026-03-09T07:00:00Z"
  }
];

/* ── Full shipment detail (sh-1) ─────────────────── */

export const shipmentDetailsMock: Record<string, Shipment> = {
  "sh-1": {
    id: "sh-1",
    shipmentNumber: "SH-2026-001",
    orderId: "ord-1",
    orderNumber: "SO-2026-1024",
    warehouseId: "wh-1",
    warehouseName: "Plant A Warehouse",
    carrierId: "car-1",
    carrierName: "FedEx Freight",
    carrierServiceId: "cs-1",
    carrierServiceName: "FedEx Freight Economy",
    originAddress: {
      id: "addr-1", addressType: "Origin", contactName: "Plant A Shipping", companyName: "Ops-Intel Manufacturing", phone: "+1-555-100-2000", email: "shipping@opsintel.com",
      addressLine1: "100 Industrial Blvd", city: "Toronto", stateOrProvince: "ON", postalCode: "M5V 2T6", country: "CA"
    },
    destinationAddress: {
      id: "addr-2", addressType: "Destination", contactName: "Alex Park", companyName: "Northline EV Components", phone: "+1-555-300-4000", email: "receiving@northline.com",
      addressLine1: "500 EV Drive", city: "Oshawa", stateOrProvince: "ON", postalCode: "L1H 7K4", country: "CA"
    },
    type: ShipmentType.Outbound,
    status: ShipmentStatus.InTransit,
    priority: ShipmentPriority.High,
    customerReference: "NLEV-PO-0045",
    trackingNumber: "FX-88291034",
    masterTrackingNumber: "FX-88291034",
    plannedShipDateUtc: "2026-03-06T14:00:00Z",
    plannedDeliveryDateUtc: "2026-03-09T18:00:00Z",
    actualShipDateUtc: "2026-03-06T14:30:00Z",
    totalWeight: 1560,
    totalVolume: 4.2,
    totalPackages: 4,
    freightCost: 1250,
    insuranceCost: 150,
    otherCharges: 75,
    totalShippingCost: 1475,
    currencyCode: "CAD",
    shippingTerms: "FOB Origin",
    incoterm: "FCA",
    isPartialShipment: false,
    requiresSignature: true,
    isFragile: false,
    isHazardous: false,
    isTemperatureControlled: false,
    isInsured: true,
    isCrossBorder: false,
    notes: "Rush order for Northline EV — deliver to dock 3",
    items: [
      {
        id: "si-1", productId: "prod-1", productName: "6061 Aluminum Extrusion Bar", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", unitOfMeasureId: "uom-2", unitOfMeasureName: "Kilogram", lineNumber: "1",
        orderedQuantity: 780, allocatedQuantity: 780, pickedQuantity: 780, packedQuantity: 780, shippedQuantity: 780, deliveredQuantity: 0, returnedQuantity: 0,
        unitWeight: 2, unitVolume: 0.005, status: ShipmentItemStatus.Shipped
      }
    ],
    packages: [
      {
        id: "pkg-1", packageNumber: "PKG-001", trackingNumber: "FX-88291034-1", packageType: "Pallet", length: 120, width: 100, height: 80, weight: 390, declaredValue: 3500,
        requiresSpecialHandling: false, isFragile: false, status: PackageStatus.InTransit,
        packageItems: [{ id: "pki-1", shipmentItemId: "si-1", lineNumber: "1", productId: "prod-1", productName: "6061 Aluminum Extrusion Bar", quantity: 195 }]
      },
      {
        id: "pkg-2", packageNumber: "PKG-002", trackingNumber: "FX-88291034-2", packageType: "Pallet", length: 120, width: 100, height: 80, weight: 390, declaredValue: 3500,
        requiresSpecialHandling: false, isFragile: false, status: PackageStatus.InTransit,
        packageItems: [{ id: "pki-2", shipmentItemId: "si-1", lineNumber: "1", productId: "prod-1", productName: "6061 Aluminum Extrusion Bar", quantity: 195 }]
      }
    ],
    trackingEvents: [
      { id: "te-1", eventCode: "PU", eventName: "Picked Up", description: "Shipment picked up from origin", eventTimeUtc: "2026-03-06T14:30:00Z", locationName: "Plant A Warehouse", city: "Toronto", stateOrProvince: "ON", country: "CA", source: "Carrier", isCustomerVisible: true },
      { id: "te-2", eventCode: "IT", eventName: "In Transit", description: "Shipment in transit to destination", eventTimeUtc: "2026-03-07T06:00:00Z", city: "Toronto", stateOrProvince: "ON", country: "CA", source: "Carrier", isCustomerVisible: true },
      { id: "te-3", eventCode: "AR", eventName: "Arrived at Terminal", eventTimeUtc: "2026-03-08T10:00:00Z", locationName: "Oshawa Terminal", city: "Oshawa", stateOrProvince: "ON", country: "CA", source: "Carrier", isCustomerVisible: true }
    ],
    documents: [
      { id: "doc-1", documentType: ShipmentDocumentType.PackingSlip, fileName: "packing-slip-SH2026001.pdf", fileUrl: "/docs/packing-slip-SH2026001.pdf", contentType: "application/pdf", fileSizeBytes: 45000, isCustomerVisible: true },
      { id: "doc-2", documentType: ShipmentDocumentType.BillOfLading, fileName: "bol-SH2026001.pdf", fileUrl: "/docs/bol-SH2026001.pdf", contentType: "application/pdf", fileSizeBytes: 62000, isCustomerVisible: true }
    ],
    charges: [
      { id: "ch-1", chargeType: ShipmentChargeType.Freight, description: "FedEx Freight Economy", amount: 1250, currencyCode: "CAD" },
      { id: "ch-2", chargeType: ShipmentChargeType.Insurance, description: "Shipment insurance", amount: 150, currencyCode: "CAD" },
      { id: "ch-3", chargeType: ShipmentChargeType.Handling, description: "Pallet handling", amount: 75, currencyCode: "CAD" }
    ],
    exceptions: [],
    insurances: [],
    statusHistories: [
      { id: "sh-h1", fromStatus: ShipmentStatus.Draft, toStatus: ShipmentStatus.Allocated, changedAtUtc: "2026-03-05T10:30:00Z", changedBy: "Sarah Chen" },
      { id: "sh-h2", fromStatus: ShipmentStatus.Allocated, toStatus: ShipmentStatus.Picking, changedAtUtc: "2026-03-06T06:00:00Z", changedBy: "Mike Johnson" },
      { id: "sh-h3", fromStatus: ShipmentStatus.Picking, toStatus: ShipmentStatus.Packed, changedAtUtc: "2026-03-06T12:00:00Z", changedBy: "Mike Johnson" },
      { id: "sh-h4", fromStatus: ShipmentStatus.Packed, toStatus: ShipmentStatus.Dispatched, changedAtUtc: "2026-03-06T14:00:00Z", changedBy: "Sarah Chen" },
      { id: "sh-h5", fromStatus: ShipmentStatus.Dispatched, toStatus: ShipmentStatus.InTransit, changedAtUtc: "2026-03-06T14:30:00Z", changedBy: "System" }
    ],
    returnShipments: [],
    createdAtUtc: "2026-03-05T10:00:00Z",
    createdBy: "Sarah Chen"
  }
};
