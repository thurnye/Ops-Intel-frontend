import type { Shipment } from "@features/shipments/types/shipments.types";

export const shipmentsMock: Shipment[] = [
  { id: "SH-220", orderId: "SO-1024", customerName: "Northline EV Components", carrier: "FedEx Freight", trackingNumber: "FX-88291034", status: "in_transit", dispatchedAt: "2026-03-06T14:00:00Z", estimatedDelivery: "2026-03-09" },
  { id: "SH-221", orderId: "SO-1025", customerName: "Urban Build Systems", carrier: "R+L Carriers", trackingNumber: "", status: "pending", dispatchedAt: null, estimatedDelivery: "2026-03-12" },
  { id: "SH-222", orderId: "SO-1026", customerName: "Pacific Thermal Inc.", carrier: "XPO Logistics", trackingNumber: "XPO-44210098", status: "packing", dispatchedAt: null, estimatedDelivery: "2026-03-14" },
  { id: "SH-223", orderId: "SO-1027", customerName: "Cascade Exterior Co.", carrier: "FedEx Freight", trackingNumber: "FX-88291078", status: "delivered", dispatchedAt: "2026-03-04T10:00:00Z", estimatedDelivery: "2026-03-06" },
  { id: "SH-224", orderId: "SO-1028", customerName: "Highland Rail Solutions", carrier: "Estes Express", trackingNumber: "EST-77120045", status: "delayed", dispatchedAt: "2026-03-05T08:00:00Z", estimatedDelivery: "2026-03-08" }
];
