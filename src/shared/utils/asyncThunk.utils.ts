import { isAxiosError } from "axios";
import type { ApiResponse, PaginationMeta } from "@shared/types/api.types";

export function getApiData<T>(response: ApiResponse<T>, fallback: T): T {
  return response.data ?? fallback;
}

export function getPagedItems<T>(response: ApiResponse<T[]>, fallback: T[] = []): T[] {
  return response.data ?? fallback;
}

export function getPaginationMeta(response: ApiResponse<unknown>): PaginationMeta | null {
  return response.meta.pagination ?? null;
}

export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (isAxiosError<{ errors?: Array<{ message?: string }> }>(error)) {
    return error.response?.data?.errors?.[0]?.message ?? error.message ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
