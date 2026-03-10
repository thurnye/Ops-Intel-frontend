import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductionOrderSummary, ProductionOrder, ProductionFilters } from "@features/production/types/production.types";
import type { PaginationMeta } from "@shared/types/api.types";
import { fetchProductionOrderById, fetchProductionOrders } from "@features/production/redux/production.thunks";

type ProductionState = {
  orders: ProductionOrderSummary[];
  orderDetails: Record<string, ProductionOrder>;
  selectedOrderId: string | null;
  filters: ProductionFilters;
  page: number;
  pageSize: number;
  pagination: PaginationMeta | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
};

const initialState: ProductionState = {
  orders: [],
  orderDetails: {},
  selectedOrderId: null,
  filters: { query: "", status: "all", priority: "all", plannedStartFrom: "", plannedStartTo: "" },
  page: 1,
  pageSize: 10,
  pagination: null,
  loading: false,
  detailLoading: false,
  error: null
};

const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {
    setSelectedProductionOrder(state, action: PayloadAction<string | null>) {
      state.selectedOrderId = action.payload;
    },
    setProductionFilters(state, action: PayloadAction<Partial<ProductionFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setProductionPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setProductionPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProductionOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load production orders.";
      })
      .addCase(fetchProductionOrderById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductionOrderById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.orderDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchProductionOrderById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload ?? "Failed to load production order details.";
      });
  }
});

export const { setSelectedProductionOrder, setProductionFilters, setProductionPage, setProductionPageSize } = productionSlice.actions;
export default productionSlice.reducer;
