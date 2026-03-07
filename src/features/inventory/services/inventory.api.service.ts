import { apiClient } from "@shared/services/apiClient.service";
import type { PaginatedResponse } from "@shared/types/api.types";
import type { InventoryItem } from "@features/inventory/types/inventory.types";

export const inventoryApi = {
  async listItems(): Promise<PaginatedResponse<InventoryItem>> {
    const { data } = await apiClient.get<PaginatedResponse<InventoryItem>>("/inventory/items");
    return data;
  }
};
