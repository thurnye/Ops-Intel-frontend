import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type { CreateOrderPayload, OrderListItem, OrderDetail, UpdateOrderPayload } from "@features/orders/types/orders.types";

export const ordersApi = {
  async listOrders(params?: { pageNumber?: number; pageSize?: number; searchTerm?: string; status?: number; orderType?: number; warehouseId?: string }): Promise<ApiResponse<OrderListItem[]>> {
    const { data } = await apiClient.get<ApiResponse<OrderListItem[]>>("/orders", { params });
    return data;
  },

  async getOrder(id: string): Promise<ApiResponse<OrderDetail>> {
    const { data } = await apiClient.get<ApiResponse<OrderDetail>>(`/orders/${id}`);
    return data;
  },

  async getOrderByNumber(orderNumber: string): Promise<ApiResponse<OrderDetail>> {
    const { data } = await apiClient.get<ApiResponse<OrderDetail>>(`/orders/by-order-number/${orderNumber}`);
    return data;
  },

  async createOrder(body: CreateOrderPayload): Promise<ApiResponse<OrderDetail>> {
    const { data } = await apiClient.post<ApiResponse<OrderDetail>>("/orders", body);
    return data;
  },

  async updateOrder(id: string, body: UpdateOrderPayload): Promise<ApiResponse<OrderDetail>> {
    const { data } = await apiClient.put<ApiResponse<OrderDetail>>(`/orders/${id}`, body);
    return data;
  },

  async deleteOrder(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/orders/${id}`);
    return data;
  },

  async changeOrderStatus(id: string, body: { status: number; reason?: string }): Promise<ApiResponse<null>> {
    const { data } = await apiClient.patch<ApiResponse<null>>(`/orders/${id}/status`, body);
    return data;
  }
};
