import { apiClient } from "@shared/services/apiClient.service";
import type { PaginatedResponse } from "@shared/types/api.types";
import type { AppUser } from "@features/users/types/users.types";

export const usersApi = {
  async listUsers(): Promise<PaginatedResponse<AppUser>> {
    const { data } = await apiClient.get<PaginatedResponse<AppUser>>("/users");
    return data;
  }
};
