import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ActivityItem, AlertSummary, KpiCardData } from "@features/dashboard/types/dashboard.types";
import { dashboardActivity, dashboardAlerts, dashboardKpis } from "@features/dashboard/mock/dashboard.mock";

type DashboardState = {
  kpis: KpiCardData[];
  alerts: AlertSummary[];
  recentActivity: ActivityItem[];
  loading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  kpis: dashboardKpis,
  alerts: dashboardAlerts,
  recentActivity: dashboardActivity,
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setKpis(state, action: PayloadAction<KpiCardData[]>) {
      state.kpis = action.payload;
    },
    setAlerts(state, action: PayloadAction<AlertSummary[]>) {
      state.alerts = action.payload;
    },
    setActivity(state, action: PayloadAction<ActivityItem[]>) {
      state.recentActivity = action.payload;
    }
  }
});

export const { setKpis, setAlerts, setActivity } = dashboardSlice.actions;
export default dashboardSlice.reducer;
