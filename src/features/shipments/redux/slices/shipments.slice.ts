import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Shipment, ShipmentFilters } from "@features/shipments/types/shipments.types";
import { shipmentsMock } from "@features/shipments/mock/shipments.mock";

type ShipmentsState = {
  shipments: Shipment[];
  selectedShipmentId: string | null;
  filters: ShipmentFilters;
  loading: boolean;
};

const initialState: ShipmentsState = {
  shipments: shipmentsMock,
  selectedShipmentId: null,
  filters: { query: "", status: "" },
  loading: false
};

const shipmentsSlice = createSlice({
  name: "shipments",
  initialState,
  reducers: {
    setShipments(state, action: PayloadAction<Shipment[]>) {
      state.shipments = action.payload;
    },
    setSelectedShipment(state, action: PayloadAction<string | null>) {
      state.selectedShipmentId = action.payload;
    },
    setShipmentFilters(state, action: PayloadAction<ShipmentFilters>) {
      state.filters = action.payload;
    }
  }
});

export const { setShipments, setSelectedShipment, setShipmentFilters } = shipmentsSlice.actions;
export default shipmentsSlice.reducer;
