import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { analyticsOverviewMock } from "@features/analytics/mock/analytics.mock";
import type { AnalyticsFilters, AnalyticsOverviewData, AnalyticsState } from "@features/analytics/types/analytics.types";

const initialState: AnalyticsState = {
  overview: analyticsOverviewMock,
  filters: { category: "", dateRange: "90d", plant: "All Plants" },
  loading: false
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setOverview(state, action: PayloadAction<AnalyticsOverviewData>) { state.overview = action.payload; },
    setAnalyticsFilters(state, action: PayloadAction<AnalyticsFilters>) { state.filters = action.payload; }
  }
});

export const { setOverview, setAnalyticsFilters } = analyticsSlice.actions;
export default analyticsSlice.reducer;
