import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type {
  ShipmentListItem,
  Shipment,
  ShipmentSummary,
  ReturnShipment
} from "@features/shipments/types/shipments.types";

export const shipmentsApi = {
  /* ── Shipments ─────────────────────────────────── */
  async listShipments(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<ShipmentListItem[]>> {
    const { data } = await apiClient.get<ApiResponse<ShipmentListItem[]>>("/shipments", { params });
    return data;
  },
  async getShipment(id: string): Promise<ApiResponse<Shipment>> {
    const { data } = await apiClient.get<ApiResponse<Shipment>>(`/shipments/${id}`);
    return data;
  },
  async getSummary(): Promise<ApiResponse<ShipmentSummary>> {
    const { data } = await apiClient.get<ApiResponse<ShipmentSummary>>("/shipments/summary");
    return data;
  },
  async updateStatus(id: string, status: number): Promise<ApiResponse<null>> {
    const { data } = await apiClient.put<ApiResponse<null>>(`/shipments/${id}/status`, { status });
    return data;
  },

  /* ── Return Shipments ──────────────────────────── */
  async listReturnShipments(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<ReturnShipment[]>> {
    const { data } = await apiClient.get<ApiResponse<ReturnShipment[]>>("/return-shipments", { params });
    return data;
  },
  async getReturnShipment(id: string): Promise<ApiResponse<ReturnShipment>> {
    const { data } = await apiClient.get<ApiResponse<ReturnShipment>>(`/return-shipments/${id}`);
    return data;
  }
};
