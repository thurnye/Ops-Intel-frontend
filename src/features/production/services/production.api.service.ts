import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type {
  ProductionOrderSummary,
  ProductionOrder,
  ProductionExecutionSummary,
  ProductionExecution,
  WorkCenter,
  Machine,
  BillOfMaterialSummary,
  RoutingSummary,
  ProductionOrderUpsertPayload,
  RoutingMetricsSummary,
  MachineMetricsSummary,
  ProductionExecutionMetricsSummary,
  ProductionOrderMetricsSummary,
  RoutingUpsertPayload,
  MachineUpsertPayload
} from "@features/production/types/production.types";
import type { BulkCreatePayload, BulkCreateResponse } from "@shared/types/bulk.types";

export const productionApi = {
  /* ── Production Orders ────────────────────────── */
  async listOrders(params?: { pageNumber?: number; pageSize?: number; searchTerm?: string; status?: number; priority?: number; plannedStartDateFrom?: string; plannedStartDateTo?: string }): Promise<ApiResponse<ProductionOrderSummary[]>> {
    const { data } = await apiClient.get<ApiResponse<ProductionOrderSummary[]>>("/production/orders", { params });
    return data;
  },

  async getOrder(id: string): Promise<ApiResponse<ProductionOrder>> {
    const { data } = await apiClient.get<ApiResponse<ProductionOrder>>(`/production/orders/${id}`);
    return data;
  },

  async getOrdersSummary(params?: { searchTerm?: string; status?: number; priority?: number; plannedStartDateFrom?: string; plannedStartDateTo?: string }): Promise<ApiResponse<ProductionOrderMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<ProductionOrderMetricsSummary>>("/production/orders/summary", { params });
    return data;
  },

  async createOrder(body: ProductionOrderUpsertPayload): Promise<ApiResponse<ProductionOrder>> {
    const { data } = await apiClient.post<ApiResponse<ProductionOrder>>("/production/orders", body);
    return data;
  },

  async createOrdersBulk(body: BulkCreatePayload<ProductionOrderUpsertPayload>): Promise<ApiResponse<BulkCreateResponse<ProductionOrder>>> {
    const { data } = await apiClient.post<ApiResponse<BulkCreateResponse<ProductionOrder>>>("/production/orders/bulk", body);
    return data;
  },

  async updateOrder(id: string, body: ProductionOrderUpsertPayload): Promise<ApiResponse<ProductionOrder>> {
    const { data } = await apiClient.put<ApiResponse<ProductionOrder>>(`/production/orders/${id}`, body);
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

  async listBillsOfMaterial(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<BillOfMaterialSummary[]>> {
    const { data } = await apiClient.get<ApiResponse<BillOfMaterialSummary[]>>("/production/bills-of-material", { params });
    return data;
  },

  async listRoutings(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<RoutingSummary[]>> {
    const { data } = await apiClient.get<ApiResponse<RoutingSummary[]>>("/production/routings", { params });
    return data;
  },

  async createRouting(body: RoutingUpsertPayload): Promise<ApiResponse<RoutingSummary>> {
    const { data } = await apiClient.post<ApiResponse<RoutingSummary>>("/production/routings", body);
    return data;
  },

  async createRoutingsBulk(body: BulkCreatePayload<RoutingUpsertPayload>): Promise<ApiResponse<BulkCreateResponse<RoutingSummary>>> {
    const { data } = await apiClient.post<ApiResponse<BulkCreateResponse<RoutingSummary>>>("/production/routings/bulk", body);
    return data;
  },

  async getRoutingsSummary(): Promise<ApiResponse<RoutingMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<RoutingMetricsSummary>>("/production/routings/summary");
    return data;
  },

  /* ── Machines ─────────────────────────────────── */
  async listMachines(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<Machine[]>> {
    const { data } = await apiClient.get<ApiResponse<Machine[]>>("/production/machines", { params });
    return data;
  },

  async createMachine(body: MachineUpsertPayload): Promise<ApiResponse<Machine>> {
    const { data } = await apiClient.post<ApiResponse<Machine>>("/production/machines", body);
    return data;
  },

  async createMachinesBulk(body: BulkCreatePayload<MachineUpsertPayload>): Promise<ApiResponse<BulkCreateResponse<Machine>>> {
    const { data } = await apiClient.post<ApiResponse<BulkCreateResponse<Machine>>>("/production/machines/bulk", body);
    return data;
  },

  async updateMachine(id: string, body: MachineUpsertPayload): Promise<ApiResponse<Machine>> {
    const { data } = await apiClient.put<ApiResponse<Machine>>(`/production/machines/${id}`, body);
    return data;
  },

  async getMachinesSummary(): Promise<ApiResponse<MachineMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<MachineMetricsSummary>>("/production/machines/summary");
    return data;
  },

  async getExecutionsSummary(): Promise<ApiResponse<ProductionExecutionMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<ProductionExecutionMetricsSummary>>("/production/executions/summary");
    return data;
  }
};
