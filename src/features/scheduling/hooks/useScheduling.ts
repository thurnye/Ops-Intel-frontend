import { useAppSelector } from "@app/hooks/app.hooks";

export function useSchedulePlans() {
  const { plans, planFilters, loading, plansPage, pageSize, plansPagination } = useAppSelector((s) => s.scheduling);
  return { plans, allPlans: plans, planFilters, loading, page: plansPage, pageSize, pagination: plansPagination };
}

export function useSchedulePlanDetail(id: string | undefined) {
  const { planDetails } = useAppSelector((s) => s.scheduling);
  return id ? planDetails[id] : undefined;
}

export function useScheduleJobs() {
  const { jobs, jobFilters, loading, jobsPage, pageSize, jobsPagination } = useAppSelector((s) => s.scheduling);
  return { jobs, allJobs: jobs, jobFilters, loading, page: jobsPage, pageSize, pagination: jobsPagination };
}

export function useScheduleJobDetail(id: string | undefined) {
  const { jobDetails } = useAppSelector((s) => s.scheduling);
  return id ? jobDetails[id] : undefined;
}

export function useScheduleExceptions() {
  const { exceptions, exceptionFilters, loading, exceptionsPage, pageSize, exceptionsPagination } = useAppSelector((s) => s.scheduling);
  return { exceptions, allExceptions: exceptions, exceptionFilters, loading, page: exceptionsPage, pageSize, pagination: exceptionsPagination };
}
