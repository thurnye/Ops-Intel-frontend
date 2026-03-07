import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ordersMock } from "@features/orders/mock/orders.mock";
import type { OrdersFilters, SalesOrder } from "@features/orders/types/orders.types";

type OrdersState = {
  orders: SalesOrder[];
  selectedOrderId: string | null;
  filters: OrdersFilters;
  page: number;
  pageSize: number;
  loading: boolean;
};

const initialState: OrdersState = {
  orders: ordersMock,
  selectedOrderId: null,
  filters: {
    query: "",
    status: "all"
  },
  page: 1,
  pageSize: 25,
  loading: false
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<SalesOrder[]>) {
      state.orders = action.payload;
    },
    setSelectedOrder(state, action: PayloadAction<string | null>) {
      state.selectedOrderId = action.payload;
    },
    setOrdersFilters(state, action: PayloadAction<OrdersFilters>) {
      state.filters = action.payload;
    },
    setOrdersPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    }
  }
});

export const { setOrders, setSelectedOrder, setOrdersFilters, setOrdersPage } = ordersSlice.actions;
export default ordersSlice.reducer;
