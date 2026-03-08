import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { orderListMock, orderDetailsMock } from "@features/orders/mock/orders.mock";
import type { OrderListItem, OrderDetail, OrdersFilters } from "@features/orders/types/orders.types";

type OrdersState = {
  orders: OrderListItem[];
  orderDetails: Record<string, OrderDetail>;
  selectedOrderId: string | null;
  filters: OrdersFilters;
  page: number;
  pageSize: number;
  loading: boolean;
};

const initialState: OrdersState = {
  orders: orderListMock,
  orderDetails: orderDetailsMock,
  selectedOrderId: null,
  filters: { query: "", status: "all", orderType: "all", paymentStatus: "all" },
  page: 1,
  pageSize: 25,
  loading: false
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<OrderListItem[]>) {
      state.orders = action.payload;
    },
    setOrderDetail(state, action: PayloadAction<OrderDetail>) {
      state.orderDetails[action.payload.id] = action.payload;
    },
    setSelectedOrder(state, action: PayloadAction<string | null>) {
      state.selectedOrderId = action.payload;
    },
    setOrdersFilters(state, action: PayloadAction<Partial<OrdersFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setOrdersPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
  }
});

export const { setOrders, setOrderDetail, setSelectedOrder, setOrdersFilters, setOrdersPage, setLoading } = ordersSlice.actions;
export default ordersSlice.reducer;
