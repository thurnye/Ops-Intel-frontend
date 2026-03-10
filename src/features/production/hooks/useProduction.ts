import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useProduction() {
  const { orders, filters, loading, page, pageSize, pagination } = useAppSelector((s) => s.production);

  const filtered = useMemo(() => {
    let result = orders;
    const q = filters.query.toLowerCase();
    if (q) {
      result = result.filter(
        (o) =>
          o.productionOrderNumber.toLowerCase().includes(q) ||
          (o.productName?.toLowerCase().includes(q)) ||
          (o.productSku?.toLowerCase().includes(q))
      );
    }
    if (filters.status !== "all") {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters.priority !== "all") {
      result = result.filter((o) => o.priority === filters.priority);
    }
    return result;
  }, [orders, filters]);

  return { orders: filtered, allOrders: orders, filters, loading, page, pageSize, pagination };
}

export function useProductionOrderDetail(id: string | undefined) {
  const { orderDetails } = useAppSelector((s) => s.production);
  return id ? orderDetails[id] : undefined;
}
