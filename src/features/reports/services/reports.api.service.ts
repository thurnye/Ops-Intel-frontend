import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type { ReportData } from "@features/reports/types/reports.types";

export const reportsApi = {
  async getReport(type: string): Promise<ApiResponse<ReportData>> {
    const { data } = await apiClient.get<ApiResponse<ReportData>>(`/reports/${type}`);
    return data;
  }
};
