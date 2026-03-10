import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrderListItem, OrderDetail, OrdersFilters } from "@features/orders/types/orders.types";
import type { PaginationMeta } from "@shared/types/api.types";
import { fetchOrderById, fetchOrders } from "@features/orders/redux/orders.thunks";

type OrdersState = {
  orders: OrderListItem[];
  orderDetails: Record<string, OrderDetail>;
  selectedOrderId: string | null;
  filters: OrdersFilters;
  page: number;
  pageSize: number;
  pagination: PaginationMeta | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  orderDetails: {},
  selectedOrderId: null,
  filters: { query: "", status: "all", orderType: "all", paymentStatus: "all" },
  page: 1,
  pageSize: 25,
  pagination: null,
  loading: false,
  detailLoading: false,
  error: null
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setSelectedOrder(state, action: PayloadAction<string | null>) {
      state.selectedOrderId = action.payload;
    },
    setOrdersFilters(state, action: PayloadAction<Partial<OrdersFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setOrdersPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setOrdersPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load orders.";
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.orderDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload ?? "Failed to load order details.";
      });
  }
});

export const { setSelectedOrder, setOrdersFilters, setOrdersPage, setOrdersPageSize } = ordersSlice.actions;
export default ordersSlice.reducer;
