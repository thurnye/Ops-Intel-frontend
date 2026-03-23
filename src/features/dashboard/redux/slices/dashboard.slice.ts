import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardDateFilterValue } from "@features/dashboard/components/Date/DashboardDateFilter";
import { dashboardOverviewShell } from "@features/dashboard/constants/dashboard.constants";
import { fetchDashboardOverview } from "@features/dashboard/redux/dashboard.thunks";
import type { DashboardOverviewData } from "@features/dashboard/types/dashboard.types";

type DashboardState = {
  overview: DashboardOverviewData;
  selectedSite: string;
  dateFilter: DashboardDateFilterValue;
  loading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  overview: dashboardOverviewShell,
  selectedSite: "all",
  dateFilter: {
    mode: "all-time",
    period: "Year To Date",
    customDate: {
      from: "",
      to: "",
    },
  },
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
    setSelectedSite(state, action: PayloadAction<string>) {
      state.selectedSite = action.payload;
    },
    setDateFilter(state, action: PayloadAction<DashboardDateFilterValue>) {
      state.dateFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load dashboard overview.";
      });
  }
});

export const {
  setDashboardOverview,
  setSelectedSite,
  setDateFilter,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
