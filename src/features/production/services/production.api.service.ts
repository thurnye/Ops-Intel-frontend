import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type {
  ProductionOrderSummary,
  ProductionOrder,
  ProductionExecutionSummary,
  ProductionExecution,
  WorkCenter,
  Machine
} from "@features/production/types/production.types";

export const productionApi = {
  /* ── Production Orders ────────────────────────── */
  async listOrders(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<ProductionOrderSummary[]>> {
    const { data } = await apiClient.get<ApiResponse<ProductionOrderSummary[]>>("/production/orders", { params });
    return data;
  },

  async getOrder(id: string): Promise<ApiResponse<ProductionOrder>> {
    const { data } = await apiClient.get<ApiResponse<ProductionOrder>>(`/production/orders/${id}`);
    return data;
  },

  async releaseOrder(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/production/orders/${id}/release`);
    return data;
  },

  async startOrder(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/production/orders/${id}/start`);
    return data;
  },

  async completeOrder(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/production/orders/${id}/complete`);
    return data;
  },

  async closeOrder(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/production/orders/${id}/close`);
    return data;
  },

  async cancelOrder(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/production/orders/${id}/cancel`);
    return data;
  },

  /* ── Executions ───────────────────────────────── */
  async listExecutions(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<ProductionExecutionSummary[]>> {
    const { data } = await apiClient.get<ApiResponse<ProductionExecutionSummary[]>>("/production/executions", { params });
    return data;
  },

  async getExecution(id: string): Promise<ApiResponse<ProductionExecution>> {
    const { data } = await apiClient.get<ApiResponse<ProductionExecution>>(`/production/executions/${id}`);
    return data;
  },

  /* ── Work Centers ─────────────────────────────── */
  async listWorkCenters(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<WorkCenter[]>> {
    const { data } = await apiClient.get<ApiResponse<WorkCenter[]>>("/production/work-centers", { params });
    return data;
  },

  /* ── Machines ─────────────────────────────────── */
  async listMachines(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<Machine[]>> {
    const { data } = await apiClient.get<ApiResponse<Machine[]>>("/production/machines", { params });
    return data;
  }
};
