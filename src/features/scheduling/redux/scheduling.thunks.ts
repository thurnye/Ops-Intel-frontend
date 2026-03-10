import { createAsyncThunk } from "@reduxjs/toolkit";
import { schedulingApi } from "@features/scheduling/services/scheduling.api.service";
import type { PaginationMeta } from "@shared/types/api.types";
import type {
  ScheduleExceptionFilters,
  ScheduleException,
  ScheduleJobFilters,
  ScheduleJob,
  ScheduleJobDetail,
  SchedulePlanFilters,
  SchedulePlan,
  SchedulePlanDetail
} from "@features/scheduling/types/scheduling.types";
import { getApiData, getErrorMessage, getPagedItems, getPaginationMeta } from "@shared/utils/asyncThunk.utils";

type SchedulePlansPayload = {
  plans: SchedulePlan[];
  plansPagination: PaginationMeta | null;
};

type ScheduleJobsPayload = {
  jobs: ScheduleJob[];
  jobsPagination: PaginationMeta | null;
};

type ScheduleExceptionsPayload = {
  exceptions: ScheduleException[];
  exceptionsPagination: PaginationMeta | null;
};

export const fetchSchedulePlans = createAsyncThunk<SchedulePlansPayload, { page: number; pageSize: number; filters: SchedulePlanFilters }, { rejectValue: string }>(
  "scheduling/fetchPlans",
  async ({ page, pageSize, filters }, { rejectWithValue }) => {
    try {
      const plansResponse = await schedulingApi.listPlans({
        pageNumber: page,
        pageSize,
        search: filters.query || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        generationMode: filters.generationMode === "all" ? undefined : filters.generationMode,
        schedulingStrategy: filters.schedulingStrategy === "all" ? undefined : filters.schedulingStrategy,
        isActive: filters.isActive === "all" ? undefined : filters.isActive,
        startDateUtc: filters.startDate || undefined,
        endDateUtc: filters.endDate || undefined
      });

      return {
        plans: getPagedItems(plansResponse),
        plansPagination: getPaginationMeta(plansResponse)
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load schedule plans."));
    }
  }
);

export const fetchScheduleJobs = createAsyncThunk<ScheduleJobsPayload, { page: number; pageSize: number; filters: ScheduleJobFilters }, { rejectValue: string }>(
  "scheduling/fetchJobs",
  async ({ page, pageSize, filters }, { rejectWithValue }) => {
    try {
      const jobsResponse = await schedulingApi.listJobs({
        pageNumber: page,
        pageSize,
        search: filters.query || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        priority: filters.priority === "all" ? undefined : filters.priority,
        materialReadinessStatus: filters.materialReadinessStatus === "all" ? undefined : filters.materialReadinessStatus,
        isRushOrder: filters.isRushOrder === "all" ? undefined : filters.isRushOrder,
        startDateUtc: filters.startDate || undefined,
        endDateUtc: filters.endDate || undefined
      });

      return {
        jobs: getPagedItems(jobsResponse),
        jobsPagination: getPaginationMeta(jobsResponse)
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load schedule jobs."));
    }
  }
);

export const fetchScheduleExceptions = createAsyncThunk<ScheduleExceptionsPayload, { page: number; pageSize: number; filters: ScheduleExceptionFilters }, { rejectValue: string }>(
  "scheduling/fetchExceptions",
  async ({ page, pageSize, filters }, { rejectWithValue }) => {
    try {
      const exceptionsResponse = await schedulingApi.listExceptions({
        pageNumber: page,
        pageSize,
        search: filters.query || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        severity: filters.severity === "all" ? undefined : filters.severity,
        assignedTo: filters.assignedTo || undefined,
        startDateUtc: filters.startDate || undefined,
        endDateUtc: filters.endDate || undefined
      });

      return {
        exceptions: getPagedItems(exceptionsResponse),
        exceptionsPagination: getPaginationMeta(exceptionsResponse)
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load schedule exceptions."));
    }
  }
);

export const fetchSchedulePlanById = createAsyncThunk<SchedulePlanDetail, string, { rejectValue: string }>(
  "scheduling/fetchPlanById",
  async (planId, { rejectWithValue }) => {
    try {
      return getApiData(await schedulingApi.getPlan(planId), null as never);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load schedule plan details."));
    }
  }
);

export const fetchScheduleJobById = createAsyncThunk<ScheduleJobDetail, string, { rejectValue: string }>(
  "scheduling/fetchJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      return getApiData(await schedulingApi.getJob(jobId), null as never);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load schedule job details."));
    }
  }
);
