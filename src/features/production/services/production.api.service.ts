import { apiClient } from "@shared/services/apiClient.service";
import type { PaginatedResponse } from "@shared/types/api.types";
import type { WorkOrder } from "@features/production/types/production.types";

export const productionApi = {
  async listWorkOrders(): Promise<PaginatedResponse<WorkOrder>> {
    const { data } = await apiClient.get<PaginatedResponse<WorkOrder>>("/production/work-orders");
    return data;
  }
};
