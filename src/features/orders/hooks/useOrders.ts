import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useOrders() {
  const state = useAppSelector((root) => root.orders);

  const filteredOrders = useMemo(() => {
    const query = state.filters.query.toLowerCase();

    return state.orders.filter((order) => {
      const queryMatch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.product.toLowerCase().includes(query);

      const statusMatch = state.filters.status === "all" || order.status === state.filters.status;

      return queryMatch && statusMatch;
    });
  }, [state.filters.query, state.filters.status, state.orders]);

  return {
    ...state,
    filteredOrders
  };
}
