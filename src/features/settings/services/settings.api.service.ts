import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type { UserProfile } from "@features/settings/types/settings.types";

export const settingsApi = {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const { data } = await apiClient.get<ApiResponse<UserProfile>>("/settings/profile");
    return data;
  }
};
