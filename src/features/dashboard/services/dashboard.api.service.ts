import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type { DashboardOverviewData } from "@features/dashboard/types/dashboard.types";

export const dashboardApi = {
  async getSummary(): Promise<ApiResponse<DashboardOverviewData>> {
    const { data } = await apiClient.get<ApiResponse<DashboardOverviewData>>("/dashboard/summary");
    return data;
  }
};
