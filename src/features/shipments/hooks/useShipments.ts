import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useShipments() {
  const { shipments, filters } = useAppSelector((s) => s.shipments);

  const filteredShipments = useMemo(() => {
    let result = shipments;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (s) => s.id.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q) || s.orderId.toLowerCase().includes(q)
      );
    }
    if (filters.status) result = result.filter((s) => s.status === filters.status);
    return result;
  }, [shipments, filters]);

  return { shipments, filteredShipments, filters };
}
