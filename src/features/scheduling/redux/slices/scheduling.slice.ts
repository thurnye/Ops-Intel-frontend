import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaginationMeta } from "@shared/types/api.types";
import type {
  SchedulePlan,
  SchedulePlanDetail,
  ScheduleJob,
  ScheduleJobDetail,
  ScheduleException,
  SchedulePlanFilters,
  ScheduleJobFilters,
  ScheduleExceptionFilters
} from "@features/scheduling/types/scheduling.types";
import { fetchScheduleExceptions, fetchScheduleJobById, fetchScheduleJobs, fetchSchedulePlanById, fetchSchedulePlans } from "@features/scheduling/redux/scheduling.thunks";

type SchedulingState = {
  plans: SchedulePlan[];
  planDetails: Record<string, SchedulePlanDetail>;
  jobs: ScheduleJob[];
  jobDetails: Record<string, ScheduleJobDetail>;
  exceptions: ScheduleException[];
  planFilters: SchedulePlanFilters;
  jobFilters: ScheduleJobFilters;
  exceptionFilters: ScheduleExceptionFilters;
  plansPage: number;
  jobsPage: number;
  exceptionsPage: number;
  pageSize: number;
  plansPagination: PaginationMeta | null;
  jobsPagination: PaginationMeta | null;
  exceptionsPagination: PaginationMeta | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
};

const initialState: SchedulingState = {
  plans: [],
  planDetails: {},
  jobs: [],
  jobDetails: {},
  exceptions: [],
  planFilters: { query: "", status: "all" },
  jobFilters: { query: "", status: "all", priority: "all" },
  exceptionFilters: { query: "", status: "all", severity: "all" },
  plansPage: 1,
  jobsPage: 1,
  exceptionsPage: 1,
  pageSize: 10,
  plansPagination: null,
  jobsPagination: null,
  exceptionsPagination: null,
  loading: false,
  detailLoading: false,
  error: null
};

const schedulingSlice = createSlice({
  name: "scheduling",
  initialState,
  reducers: {
    setPlanFilters(state, action: PayloadAction<Partial<SchedulePlanFilters>>) {
      state.planFilters = { ...state.planFilters, ...action.payload };
    },
    setJobFilters(state, action: PayloadAction<Partial<ScheduleJobFilters>>) {
      state.jobFilters = { ...state.jobFilters, ...action.payload };
    },
    setExceptionFilters(state, action: PayloadAction<Partial<ScheduleExceptionFilters>>) {
      state.exceptionFilters = { ...state.exceptionFilters, ...action.payload };
    },
    setPlansPage(state, action: PayloadAction<number>) {
      state.plansPage = action.payload;
    },
    setJobsPage(state, action: PayloadAction<number>) {
      state.jobsPage = action.payload;
    },
    setExceptionsPage(state, action: PayloadAction<number>) {
      state.exceptionsPage = action.payload;
    },
    setSchedulingPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedulePlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedulePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.plans;
        state.plansPagination = action.payload.plansPagination;
      })
      .addCase(fetchSchedulePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load schedule plans.";
      })
      .addCase(fetchScheduleJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScheduleJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.jobsPagination = action.payload.jobsPagination;
      })
      .addCase(fetchScheduleJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load schedule jobs.";
      })
      .addCase(fetchScheduleExceptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScheduleExceptions.fulfilled, (state, action) => {
        state.loading = false;
        state.exceptions = action.payload.exceptions;
        state.exceptionsPagination = action.payload.exceptionsPagination;
      })
      .addCase(fetchScheduleExceptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load schedule exceptions.";
      })
      .addCase(fetchSchedulePlanById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchSchedulePlanById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.planDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchSchedulePlanById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload ?? "Failed to load schedule plan details.";
      })
      .addCase(fetchScheduleJobById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchScheduleJobById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.jobDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchScheduleJobById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload ?? "Failed to load schedule job details.";
      });
  }
});

export const {
  setPlanFilters, setJobFilters, setExceptionFilters, setPlansPage, setJobsPage, setExceptionsPage, setSchedulingPageSize
} = schedulingSlice.actions;
export default schedulingSlice.reducer;
