import { useAppSelector } from "@app/hooks/app.hooks";

export function useOrders() {
  const { orders, filters, loading, page, pageSize, pagination } = useAppSelector((s) => s.orders);
  return { orders, allOrders: orders, filters, loading, page, pageSize, pagination };
}

export function useOrderDetail(id: string | undefined) {
  const { orderDetails } = useAppSelector((s) => s.orders);
  return id ? orderDetails[id] : undefined;
}
