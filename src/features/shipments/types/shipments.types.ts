export type ShipmentStatus = "pending" | "packing" | "dispatched" | "in_transit" | "delivered" | "delayed";

export type Shipment = {
  id: string;
  orderId: string;
  customerName: string;
  carrier: string;
  trackingNumber: string;
  status: ShipmentStatus;
  dispatchedAt: string | null;
  estimatedDelivery: string;
};

export type ShipmentFilters = {
  query: string;
  status: ShipmentStatus | "";
};
