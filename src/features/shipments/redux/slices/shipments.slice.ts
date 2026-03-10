import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShipmentListItem, Shipment, ShipmentFilters } from "@features/shipments/types/shipments.types";
import type { PaginationMeta } from "@shared/types/api.types";
import { fetchShipmentById, fetchShipments } from "@features/shipments/redux/shipments.thunks";

type ShipmentsState = {
  shipments: ShipmentListItem[];
  shipmentDetails: Record<string, Shipment>;
  filters: ShipmentFilters;
  page: number;
  pageSize: number;
  pagination: PaginationMeta | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
};

const initialState: ShipmentsState = {
  shipments: [],
  shipmentDetails: {},
  filters: { query: "", status: "all", type: "all", priority: "all" },
  page: 1,
  pageSize: 10,
  pagination: null,
  loading: false,
  detailLoading: false,
  error: null
};

const shipmentsSlice = createSlice({
  name: "shipments",
  initialState,
  reducers: {
    setShipmentFilters(state, action: PayloadAction<Partial<ShipmentFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setShipmentsPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setShipmentsPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = action.payload.shipments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load shipments.";
      })
      .addCase(fetchShipmentById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.shipmentDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchShipmentById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload ?? "Failed to load shipment details.";
      });
  }
});

export const { setShipmentFilters, setShipmentsPage, setShipmentsPageSize } = shipmentsSlice.actions;
export default shipmentsSlice.reducer;
