import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Alert, AlertsFilters } from "@features/alerts/types/alerts.types";
import { alertsMock } from "@features/alerts/mock/alerts.mock";

type AlertsState = { alerts: Alert[]; filters: AlertsFilters; loading: boolean };

const initialState: AlertsState = {
  alerts: alertsMock,
  filters: { severity: "", category: "", showResolved: false },
  loading: false
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlerts(state, action: PayloadAction<Alert[]>) { state.alerts = action.payload; },
    setAlertsFilters(state, action: PayloadAction<AlertsFilters>) { state.filters = action.payload; },
    markAlertRead(state, action: PayloadAction<string>) {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert) alert.isRead = true;
    },
    resolveAlert(state, action: PayloadAction<string>) {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert) { alert.isResolved = true; alert.isRead = true; }
    }
  }
});

export const { setAlerts, setAlertsFilters, markAlertRead, resolveAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
