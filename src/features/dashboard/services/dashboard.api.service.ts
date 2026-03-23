import type { DashboardDateFilterValue } from "@features/dashboard/components/Date/DashboardDateFilter";
import { resolveDashboardDateFilter } from "@features/dashboard/components/Date/dateFilterResolver.utils";
import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type { DashboardOverviewApiResponse } from "@features/dashboard/types/dashboard.types";

export const dashboardApi = {
  async getOverview(params?: {
    site?: string;
    dateFilter?: DashboardDateFilterValue;
  }): Promise<ApiResponse<DashboardOverviewApiResponse>> {
    const resolvedDateFilter = resolveDashboardDateFilter(params?.dateFilter);
    const requestParams = {
      site: params?.site,
      mode: resolvedDateFilter.mode,
      period: resolvedDateFilter.period,
      from: resolvedDateFilter.from,
      to: resolvedDateFilter.to,
    };
    const { data } = await apiClient.get<ApiResponse<DashboardOverviewApiResponse>>("/dashboard/overview", {
      params: requestParams,
    });
    return data;
  }
};
