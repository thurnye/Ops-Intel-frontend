import { apiClient } from "@shared/services/apiClient.service";
import type { PaginatedResponse } from "@shared/types/api.types";
import type { Shipment } from "@features/shipments/types/shipments.types";

export const shipmentsApi = {
  async listShipments(): Promise<PaginatedResponse<Shipment>> {
    const { data } = await apiClient.get<PaginatedResponse<Shipment>>("/shipments");
    return data;
  }
};
