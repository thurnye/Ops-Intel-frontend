import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductionFilters, WorkOrder } from "@features/production/types/production.types";
import { productionMock } from "@features/production/mock/production.mock";

type ProductionState = {
  workOrders: WorkOrder[];
  selectedJobId: string | null;
  filters: ProductionFilters;
  loading: boolean;
};

const initialState: ProductionState = {
  workOrders: productionMock,
  selectedJobId: null,
  filters: { query: "", status: "", line: "" },
  loading: false
};

const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {
    setWorkOrders(state, action: PayloadAction<WorkOrder[]>) {
      state.workOrders = action.payload;
    },
    setSelectedJob(state, action: PayloadAction<string | null>) {
      state.selectedJobId = action.payload;
    },
    setProductionFilters(state, action: PayloadAction<ProductionFilters>) {
      state.filters = action.payload;
    }
  }
});

export const { setWorkOrders, setSelectedJob, setProductionFilters } = productionSlice.actions;
export default productionSlice.reducer;
