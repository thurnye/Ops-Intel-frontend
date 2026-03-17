import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type { AnalyticsOverviewData } from "@features/analytics/types/analytics.types";

export const analyticsApi = {
  async getOverview(): Promise<ApiResponse<AnalyticsOverviewData>> {
    const { data } = await apiClient.get<ApiResponse<AnalyticsOverviewData>>("/analytics/overview");
    return data;
  }
};
