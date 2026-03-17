import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { dashboardOverviewMock } from "@features/dashboard/mock/dashboard.mock";
import type { DashboardOverviewData } from "@features/dashboard/types/dashboard.types";

type DashboardState = {
  overview: DashboardOverviewData;
  selectedRange: string;
  selectedSite: string;
  loading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  overview: dashboardOverviewMock,
  selectedRange: "30d",
  selectedSite: "all",
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardOverview(state, action: PayloadAction<DashboardOverviewData>) {
      state.overview = action.payload;
    },
    setSelectedRange(state, action: PayloadAction<string>) {
      state.selectedRange = action.payload;
    },
    setSelectedSite(state, action: PayloadAction<string>) {
      state.selectedSite = action.payload;
    }
  }
});

export const { setDashboardOverview, setSelectedRange, setSelectedSite } = dashboardSlice.actions;
export default dashboardSlice.reducer;
