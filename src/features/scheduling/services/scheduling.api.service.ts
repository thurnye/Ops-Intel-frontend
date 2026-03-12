import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type {
  SchedulePlan,
  SchedulePlanDetail,
  ScheduleJob,
  ScheduleJobDetail,
  ScheduleOperation,
  ScheduleOperationDetail,
  DispatchQueueItem,
  Shift,
  ResourceCalendar,
  CapacityReservation,
  ResourceCapacitySnapshot,
  ScheduleException,
  ScheduleMaterialCheck,
  ScheduleRevision,
  ScheduleRescheduleHistory,
  ScheduleStatusHistory,
  ScheduleAuditLog,
  ShiftMetricsSummary,
  DispatchMetricsSummary
} from "@features/scheduling/types/scheduling.types";

export const schedulingApi = {
  /* ── Schedule Plans ────────────────────────────── */
  async listPlans(params?: { pageNumber?: number; pageSize?: number; search?: string; status?: number; generationMode?: number; schedulingStrategy?: number; isActive?: boolean; startDateUtc?: string; endDateUtc?: string }): Promise<ApiResponse<SchedulePlan[]>> {
    const { data } = await apiClient.get<ApiResponse<SchedulePlan[]>>("/scheduling/plans", { params });
    return data;
  },
  async getPlan(id: string): Promise<ApiResponse<SchedulePlanDetail>> {
    const { data } = await apiClient.get<ApiResponse<SchedulePlanDetail>>(`/scheduling/plans/${id}`);
    return data;
  },
  async createPlan(body: import("@features/scheduling/types/scheduling.types").SchedulePlanUpsertPayload): Promise<ApiResponse<SchedulePlanDetail>> {
    const { data } = await apiClient.post<ApiResponse<SchedulePlanDetail>>("/scheduling/plans", body);
    return data;
  },
  async updatePlan(id: string, body: import("@features/scheduling/types/scheduling.types").SchedulePlanUpsertPayload): Promise<ApiResponse<SchedulePlanDetail>> {
    const { data } = await apiClient.put<ApiResponse<SchedulePlanDetail>>(`/scheduling/plans/${id}`, body);
    return data;
  },
  async deletePlan(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/scheduling/plans/${id}`);
    return data;
  },
  async publishPlan(id: string, body: Record<string, unknown> = {}): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/scheduling/plans/${id}/publish`, body);
    return data;
  },
  async clonePlan(id: string, body: Record<string, unknown> = {}): Promise<ApiResponse<SchedulePlan>> {
    const { data } = await apiClient.post<ApiResponse<SchedulePlan>>(`/scheduling/plans/${id}/clone`, body);
    return data;
  },

  /* ── Schedule Jobs ─────────────────────────────── */
  async listJobs(params?: { pageNumber?: number; pageSize?: number; search?: string; status?: number; priority?: number; materialReadinessStatus?: number; isRushOrder?: boolean; startDateUtc?: string; endDateUtc?: string }): Promise<ApiResponse<ScheduleJob[]>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleJob[]>>("/scheduling/jobs", { params });
    return data;
  },
  async getJob(id: string): Promise<ApiResponse<ScheduleJobDetail>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleJobDetail>>(`/scheduling/jobs/${id}`);
    return data;
  },
  async createJob(body: import("@features/scheduling/types/scheduling.types").ScheduleJobUpsertPayload): Promise<ApiResponse<ScheduleJobDetail>> {
    const { data } = await apiClient.post<ApiResponse<ScheduleJobDetail>>("/scheduling/jobs", body);
    return data;
  },
  async updateJob(id: string, body: import("@features/scheduling/types/scheduling.types").ScheduleJobUpsertPayload): Promise<ApiResponse<ScheduleJobDetail>> {
    const { data } = await apiClient.put<ApiResponse<ScheduleJobDetail>>(`/scheduling/jobs/${id}`, body);
    return data;
  },
  async deleteJob(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/scheduling/jobs/${id}`);
    return data;
  },
  async getDispatchSummary(): Promise<ApiResponse<DispatchMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<DispatchMetricsSummary>>("/scheduling/jobs/dispatch-summary");
    return data;
  },
  async releaseJob(id: string, body: Record<string, unknown> = {}): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/scheduling/jobs/${id}/release`, body);
    return data;
  },
  async pauseJob(id: string, body: Record<string, unknown> = {}): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/scheduling/jobs/${id}/pause`, body);
    return data;
  },
  async cancelJob(id: string, body: Record<string, unknown> = {}): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/scheduling/jobs/${id}/cancel`, body);
    return data;
  },

  /* ── Schedule Operations ───────────────────────── */
  async listOperations(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<ScheduleOperation[]>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleOperation[]>>("/scheduling/operations", { params });
    return data;
  },
  async getOperation(id: string): Promise<ApiResponse<ScheduleOperationDetail>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleOperationDetail>>(`/scheduling/operations/${id}`);
    return data;
  },
  async startOperation(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/scheduling/operations/${id}/start`);
    return data;
  },
  async completeOperation(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/scheduling/operations/${id}/complete`);
    return data;
  },

  /* ── Dispatch ──────────────────────────────────── */
  async getDispatchQueueItem(id: string): Promise<ApiResponse<DispatchQueueItem>> {
    const { data } = await apiClient.get<ApiResponse<DispatchQueueItem>>(`/scheduling/dispatch/queue-items/${id}`);
    return data;
  },
  async releaseDispatch(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/scheduling/dispatch/queue-items/${id}/release`);
    return data;
  },
  async acknowledgeDispatch(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/scheduling/dispatch/queue-items/${id}/acknowledge`);
    return data;
  },

  /* ── Shifts ────────────────────────────────────── */
  async listShifts(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<Shift[]>> {
    const { data } = await apiClient.get<ApiResponse<Shift[]>>("/scheduling/shifts", { params });
    return data;
  },
  async getShift(id: string): Promise<ApiResponse<Shift>> {
    const { data } = await apiClient.get<ApiResponse<Shift>>(`/scheduling/shifts/${id}`);
    return data;
  },
  async getShiftsSummary(): Promise<ApiResponse<ShiftMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<ShiftMetricsSummary>>("/scheduling/shifts/summary");
    return data;
  },

  /* ── Resource Calendars ────────────────────────── */
  async getResourceCalendar(id: string): Promise<ApiResponse<ResourceCalendar>> {
    const { data } = await apiClient.get<ApiResponse<ResourceCalendar>>(`/scheduling/resource-calendars/${id}`);
    return data;
  },

  /* ── Capacity ──────────────────────────────────── */
  async getCapacityReservation(id: string): Promise<ApiResponse<CapacityReservation>> {
    const { data } = await apiClient.get<ApiResponse<CapacityReservation>>(`/scheduling/capacity/reservations/${id}`);
    return data;
  },
  async listCapacityUtilization(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<ResourceCapacitySnapshot[]>> {
    const { data } = await apiClient.get<ApiResponse<ResourceCapacitySnapshot[]>>("/scheduling/capacity/utilization", { params });
    return data;
  },

  /* ── Exceptions ────────────────────────────────── */
  async listExceptions(params?: { pageNumber?: number; pageSize?: number; search?: string; status?: number; severity?: number; assignedTo?: string; startDateUtc?: string; endDateUtc?: string }): Promise<ApiResponse<ScheduleException[]>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleException[]>>("/scheduling/exceptions", { params });
    return data;
  },
  async getException(id: string): Promise<ApiResponse<ScheduleException>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleException>>(`/scheduling/exceptions/${id}`);
    return data;
  },
  async resolveException(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(`/scheduling/exceptions/${id}/resolve`);
    return data;
  },

  /* ── Material Checks ───────────────────────────── */
  async getMaterialCheck(id: string): Promise<ApiResponse<ScheduleMaterialCheck>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleMaterialCheck>>(`/scheduling/material-checks/${id}`);
    return data;
  },

  /* ── Revisions / History ───────────────────────── */
  async getRevision(id: string): Promise<ApiResponse<ScheduleRevision>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleRevision>>(`/scheduling/revisions/${id}`);
    return data;
  },
  async getRescheduleHistory(id: string): Promise<ApiResponse<ScheduleRescheduleHistory>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleRescheduleHistory>>(`/scheduling/revisions/reschedule-history/${id}`);
    return data;
  },
  async getStatusHistory(id: string): Promise<ApiResponse<ScheduleStatusHistory>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleStatusHistory>>(`/scheduling/revisions/status-history/${id}`);
    return data;
  },

  /* ── Audit ─────────────────────────────────────── */
  async listAuditLogs(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<ScheduleAuditLog[]>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleAuditLog[]>>("/scheduling/audit", { params });
    return data;
  },
  async getAuditLog(id: string): Promise<ApiResponse<ScheduleAuditLog>> {
    const { data } = await apiClient.get<ApiResponse<ScheduleAuditLog>>(`/scheduling/audit/${id}`);
    return data;
  }
};
