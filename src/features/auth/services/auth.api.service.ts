import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  AuthResponse,
  User,
  Session
} from "@features/auth/types/auth.types";

export const authApi = {
  async login(payload: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return data;
  },

  async register(payload: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload);
    return data;
  },

  async refresh(): Promise<ApiResponse<AuthResponse>> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/refresh");
    return data;
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>("/auth/forgot-password", payload);
    return data;
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>("/auth/reset-password", payload);
    return data;
  },

  async verifyEmail(payload: VerifyEmailRequest): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>("/auth/verify-email", payload);
    return data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/profile");
    return data;
  },

  async getSessions(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<Session[]>> {
    const { data } = await apiClient.get<ApiResponse<Session[]>>("/auth/sessions", { params });
    return data;
  },

  async revokeSession(sessionId: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/auth/sessions/${sessionId}`);
    return data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>("/auth/logout");
    return data;
  }
};
