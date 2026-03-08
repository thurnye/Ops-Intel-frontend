import { apiClient } from "@shared/services/apiClient.service";
import type { PaginatedResponse } from "@shared/types/api.types";
import type { ScheduleEntry } from "@features/scheduling/types/scheduling.types";

export const schedulingApi = {
  async listEntries(): Promise<PaginatedResponse<ScheduleEntry>> {
    const { data } = await apiClient.get<PaginatedResponse<ScheduleEntry>>("/scheduling/entries");
    return data;
  }
};
