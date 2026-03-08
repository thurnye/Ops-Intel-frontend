import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type { AnalyticsDataset } from "@features/analytics/types/analytics.types";

export const analyticsApi = {
  async getDataset(category: string): Promise<ApiResponse<AnalyticsDataset>> {
    const { data } = await apiClient.get<ApiResponse<AnalyticsDataset>>(`/analytics/${category}`);
    return data;
  }
};
