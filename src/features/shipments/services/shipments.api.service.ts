import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type {
  Carrier,
  CarrierService,
  ShipmentListItem,
  Shipment,
  ShipmentSummary,
  ReturnShipment,
  ShipmentAddress,
  ShipmentUpsertPayload,
  CarrierMetricsSummary,
  ShipmentAddressMetricsSummary
} from "@features/shipments/types/shipments.types";

export const shipmentsApi = {
  /* ── Shipments ─────────────────────────────────── */
  async listShipments(params?: { pageNumber?: number; pageSize?: number; search?: string; status?: number; type?: number; priority?: number; isCrossBorder?: boolean; isPartialShipment?: boolean }): Promise<ApiResponse<ShipmentListItem[]>> {
    const { data } = await apiClient.get<ApiResponse<ShipmentListItem[]>>("/shipments", { params });
    return data;
  },
  async getShipment(id: string): Promise<ApiResponse<Shipment>> {
    const { data } = await apiClient.get<ApiResponse<Shipment>>(`/shipments/${id}`);
    return data;
  },
  async createShipment(body: ShipmentUpsertPayload): Promise<ApiResponse<Shipment>> {
    const { data } = await apiClient.post<ApiResponse<Shipment>>("/shipments", body);
    return data;
  },
  async updateShipment(id: string, body: ShipmentUpsertPayload): Promise<ApiResponse<Shipment>> {
    const { data } = await apiClient.put<ApiResponse<Shipment>>(`/shipments/${id}`, body);
    return data;
  },
  async deleteShipment(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/shipments/${id}`);
    return data;
  },
  async getSummary(params?: { search?: string; status?: number; type?: number; priority?: number; isCrossBorder?: boolean; isPartialShipment?: boolean }): Promise<ApiResponse<ShipmentSummary>> {
    const { data } = await apiClient.get<ApiResponse<ShipmentSummary>>("/shipments/summary", { params });
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
  },

  async listCarriers(params?: { pageNumber?: number; pageSize?: number; search?: string; isActive?: boolean }): Promise<ApiResponse<Carrier[]>> {
    const { data } = await apiClient.get<ApiResponse<Carrier[]>>("/shipment-carriers", { params });
    return data;
  },

  async getCarriersSummary(params?: { search?: string; isActive?: boolean }): Promise<ApiResponse<CarrierMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<CarrierMetricsSummary>>("/shipment-carriers/summary", { params });
    return data;
  },

  async listCarrierServices(carrierId: string, params?: { isActive?: boolean }): Promise<ApiResponse<CarrierService[]>> {
    const { data } = await apiClient.get<ApiResponse<CarrierService[]>>(`/shipment-carriers/${carrierId}/services`, { params });
    return data;
  },

  async searchAddresses(params?: { search?: string; country?: string; city?: string; take?: number }): Promise<ApiResponse<ShipmentAddress[]>> {
    const { data } = await apiClient.get<ApiResponse<ShipmentAddress[]>>("/shipment-addresses/search", { params });
    return data;
  },

  async getAddressesSummary(params?: { search?: string; country?: string; city?: string }): Promise<ApiResponse<ShipmentAddressMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<ShipmentAddressMetricsSummary>>("/shipment-addresses/summary", { params });
    return data;
  }
};
