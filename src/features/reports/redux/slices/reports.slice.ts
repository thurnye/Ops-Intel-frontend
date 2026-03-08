import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ReportData, ReportsFilters } from "@features/reports/types/reports.types";
import { reportsMock } from "@features/reports/mock/reports.mock";

type ReportsState = { reports: ReportData[]; filters: ReportsFilters; loading: boolean };

const initialState: ReportsState = {
  reports: reportsMock,
  filters: { type: "", dateRange: "month" },
  loading: false
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReports(state, action: PayloadAction<ReportData[]>) { state.reports = action.payload; },
    setReportsFilters(state, action: PayloadAction<ReportsFilters>) { state.filters = action.payload; }
  }
});

export const { setReports, setReportsFilters } = reportsSlice.actions;
export default reportsSlice.reducer;
