import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AnalyticsDataset, AnalyticsFilters } from "@features/analytics/types/analytics.types";
import { analyticsMock } from "@features/analytics/mock/analytics.mock";

type AnalyticsState = { datasets: AnalyticsDataset[]; filters: AnalyticsFilters; loading: boolean };

const initialState: AnalyticsState = {
  datasets: analyticsMock,
  filters: { category: "", dateRange: "30d" },
  loading: false
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setDatasets(state, action: PayloadAction<AnalyticsDataset[]>) { state.datasets = action.payload; },
    setAnalyticsFilters(state, action: PayloadAction<AnalyticsFilters>) { state.filters = action.payload; }
  }
});

export const { setDatasets, setAnalyticsFilters } = analyticsSlice.actions;
export default analyticsSlice.reducer;
