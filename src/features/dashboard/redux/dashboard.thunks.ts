import { createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardDateFilterValue } from "@features/dashboard/components/Date/DashboardDateFilter";
import { dashboardApi } from "@features/dashboard/services/dashboard.api.service";
import type { DashboardOverviewApiResponse, DashboardOverviewData } from "@features/dashboard/types/dashboard.types";
import { mapDashboardOverviewResponse } from "@features/dashboard/utils/dashboard.mapper";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export const fetchDashboardOverview = createAsyncThunk<
  DashboardOverviewData,
  { site: string; dateFilter: DashboardDateFilterValue },
  { rejectValue: string }
>("dashboard/fetchOverview", async ({ site, dateFilter }, { rejectWithValue }) => {
  try {
    const response = await dashboardApi.getOverview({ site, dateFilter });
    const data = getApiData(response, null as never as DashboardOverviewApiResponse);
    return mapDashboardOverviewResponse(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to load dashboard overview."));
  }
});
