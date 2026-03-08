import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse, PagedResponse } from "@shared/types/api.types";
import type { OrderListItem, OrderDetail } from "@features/orders/types/orders.types";

export const ordersApi = {
  async listOrders(params?: { page?: number; limit?: number; search?: string; status?: number; orderType?: number }): Promise<ApiResponse<OrderListItem[]>> {
    const { data } = await apiClient.get<ApiResponse<OrderListItem[]>>("/orders", { params });
    return data;
  },

  async getOrder(id: string): Promise<ApiResponse<OrderDetail>> {
    const { data } = await apiClient.get<ApiResponse<OrderDetail>>(`/orders/${id}`);
    return data;
  },

  async changeOrderStatus(id: string, body: { status: number; reason?: string }): Promise<ApiResponse<null>> {
    const { data } = await apiClient.put<ApiResponse<null>>(`/orders/${id}/status`, body);
    return data;
  }
};
