import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useOrders() {
  const { orders, filters, loading, page, pageSize } = useAppSelector((s) => s.orders);

  const filteredOrders = useMemo(() => {
    let result = orders;
    const q = filters.query.toLowerCase();
    if (q) {
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          (o.customerName?.toLowerCase().includes(q))
      );
    }
    if (filters.status !== "all") {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters.orderType !== "all") {
      result = result.filter((o) => o.orderType === filters.orderType);
    }
    if (filters.paymentStatus !== "all") {
      result = result.filter((o) => o.paymentStatus === filters.paymentStatus);
    }
    return result;
  }, [orders, filters]);

  return { orders: filteredOrders, allOrders: orders, filters, loading, page, pageSize };
}

export function useOrderDetail(id: string | undefined) {
  const { orderDetails } = useAppSelector((s) => s.orders);
  return id ? orderDetails[id] : undefined;
}
