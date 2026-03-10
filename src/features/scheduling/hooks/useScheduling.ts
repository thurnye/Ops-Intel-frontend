import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useSchedulePlans() {
  const { plans, planFilters, loading, plansPage, pageSize, plansPagination } = useAppSelector((s) => s.scheduling);

  const filtered = useMemo(() => {
    let result = plans;
    const q = planFilters.query.toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.planNumber.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q)
      );
    }
    if (planFilters.status !== "all") {
      result = result.filter((p) => p.status === planFilters.status);
    }
    return result;
  }, [plans, planFilters]);

  return { plans: filtered, allPlans: plans, planFilters, loading, page: plansPage, pageSize, pagination: plansPagination };
}

export function useSchedulePlanDetail(id: string | undefined) {
  const { planDetails } = useAppSelector((s) => s.scheduling);
  return id ? planDetails[id] : undefined;
}

export function useScheduleJobs() {
  const { jobs, jobFilters, loading, jobsPage, pageSize, jobsPagination } = useAppSelector((s) => s.scheduling);

  const filtered = useMemo(() => {
    let result = jobs;
    const q = jobFilters.query.toLowerCase();
    if (q) {
      result = result.filter(
        (j) =>
          j.jobNumber.toLowerCase().includes(q) ||
          j.jobName.toLowerCase().includes(q) ||
          (j.productName?.toLowerCase().includes(q)) ||
          (j.productSku?.toLowerCase().includes(q))
      );
    }
    if (jobFilters.status !== "all") {
      result = result.filter((j) => j.status === jobFilters.status);
    }
    if (jobFilters.priority !== "all") {
      result = result.filter((j) => j.priority === jobFilters.priority);
    }
    return result;
  }, [jobs, jobFilters]);

  return { jobs: filtered, allJobs: jobs, jobFilters, loading, page: jobsPage, pageSize, pagination: jobsPagination };
}

export function useScheduleJobDetail(id: string | undefined) {
  const { jobDetails } = useAppSelector((s) => s.scheduling);
  return id ? jobDetails[id] : undefined;
}

export function useScheduleExceptions() {
  const { exceptions, exceptionFilters, loading, exceptionsPage, pageSize, exceptionsPagination } = useAppSelector((s) => s.scheduling);

  const filtered = useMemo(() => {
    let result = exceptions;
    const q = exceptionFilters.query.toLowerCase();
    if (q) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }
    if (exceptionFilters.status !== "all") {
      result = result.filter((e) => e.status === exceptionFilters.status);
    }
    if (exceptionFilters.severity !== "all") {
      result = result.filter((e) => e.severity === exceptionFilters.severity);
    }
    return result;
  }, [exceptions, exceptionFilters]);

  return { exceptions: filtered, allExceptions: exceptions, exceptionFilters, loading, page: exceptionsPage, pageSize, pagination: exceptionsPagination };
}
