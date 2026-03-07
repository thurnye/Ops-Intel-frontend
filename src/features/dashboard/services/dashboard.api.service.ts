import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type { ActivityItem, AlertSummary, KpiCardData } from "@features/dashboard/types/dashboard.types";

export type DashboardPayload = {
  kpis: KpiCardData[];
  alerts: AlertSummary[];
  recentActivity: ActivityItem[];
};

export const dashboardApi = {
  async getSummary(): Promise<ApiResponse<DashboardPayload>> {
    const { data } = await apiClient.get<ApiResponse<DashboardPayload>>("/dashboard/summary");
    return data;
  }
};
