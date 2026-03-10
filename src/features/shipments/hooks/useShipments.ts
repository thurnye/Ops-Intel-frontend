import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useShipments() {
  const { shipments, filters, loading, page, pageSize, pagination } = useAppSelector((s) => s.shipments);

  const filtered = useMemo(() => {
    let result = shipments;
    const q = filters.query.toLowerCase();
    if (q) {
      result = result.filter(
        (s) =>
          s.shipmentNumber.toLowerCase().includes(q) ||
          (s.orderNumber?.toLowerCase().includes(q)) ||
          (s.carrierName?.toLowerCase().includes(q)) ||
          (s.trackingNumber?.toLowerCase().includes(q))
      );
    }
    if (filters.status !== "all") {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters.type !== "all") {
      result = result.filter((s) => s.type === filters.type);
    }
    if (filters.priority !== "all") {
      result = result.filter((s) => s.priority === filters.priority);
    }
    return result;
  }, [shipments, filters]);

  return { shipments: filtered, allShipments: shipments, filters, loading, page, pageSize, pagination };
}

export function useShipmentDetail(id: string | undefined) {
  const { shipmentDetails } = useAppSelector((s) => s.shipments);
  return id ? shipmentDetails[id] : undefined;
}
