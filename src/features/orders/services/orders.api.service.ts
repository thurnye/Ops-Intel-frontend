import { apiClient } from "@shared/services/apiClient.service";
import type { PaginatedResponse } from "@shared/types/api.types";
import type { SalesOrder } from "@features/orders/types/orders.types";

export const ordersApi = {
  async listOrders(): Promise<PaginatedResponse<SalesOrder>> {
    const { data } = await apiClient.get<PaginatedResponse<SalesOrder>>("/orders");
    return data;
  }
};
