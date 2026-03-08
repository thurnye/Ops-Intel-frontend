import { apiClient } from "@shared/services/apiClient.service";
import type { PaginatedResponse } from "@shared/types/api.types";
import type { Alert } from "@features/alerts/types/alerts.types";

export const alertsApi = {
  async listAlerts(): Promise<PaginatedResponse<Alert>> {
    const { data } = await apiClient.get<PaginatedResponse<Alert>>("/alerts");
    return data;
  }
};
