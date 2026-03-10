import { useAppSelector } from "@app/hooks/app.hooks";

export function useShipments() {
  const { shipments, filters, loading, page, pageSize, pagination } = useAppSelector((s) => s.shipments);
  return { shipments, allShipments: shipments, filters, loading, page, pageSize, pagination };
}

export function useShipmentDetail(id: string | undefined) {
  const { shipmentDetails } = useAppSelector((s) => s.shipments);
  return id ? shipmentDetails[id] : undefined;
}
