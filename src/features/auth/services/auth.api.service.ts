import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type { AuthSession, LoginPayload } from "@features/auth/types/auth.types";

export const authApi = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthSession>> {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>("/auth/login", payload);
    return data;
  }
};
