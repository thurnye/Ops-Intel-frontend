import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WorkOrder } from "@features/production/types/production.types";

type ProductionState = {
  workOrders: WorkOrder[];
};

const initialState: ProductionState = {
  workOrders: []
};

const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {
    setWorkOrders(state, action: PayloadAction<WorkOrder[]>) {
      state.workOrders = action.payload;
    }
  }
});

export const { setWorkOrders } = productionSlice.actions;
export default productionSlice.reducer;
