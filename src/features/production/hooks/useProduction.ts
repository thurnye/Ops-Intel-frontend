import { useAppSelector } from "@app/hooks/app.hooks";

export function useProduction() {
  const { orders, filters, loading, page, pageSize, pagination } = useAppSelector((s) => s.production);
  return { orders, allOrders: orders, filters, loading, page, pageSize, pagination };
}

export function useProductionOrderDetail(id: string | undefined) {
  const { orderDetails } = useAppSelector((s) => s.production);
  return id ? orderDetails[id] : undefined;
}
