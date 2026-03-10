import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { OperationsHubPage } from "@app/components/OperationsHubPage";
import { schedulingApi } from "@features/scheduling/services/scheduling.api.service";
import { getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";

export function SchedulingDispatchPage() {
  const [stats, setStats] = useState({ jobs: 0, released: 0, running: 0, blockers: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      schedulingApi.listJobs({ pageNumber: 1, pageSize: 100 }),
      schedulingApi.listExceptions({ pageNumber: 1, pageSize: 100 })
    ])
      .then(([jobsResponse, exceptionsResponse]) => {
        const jobs = getPagedItems(jobsResponse);
        const exceptions = getPagedItems(exceptionsResponse);
        setStats({
          jobs: jobs.length,
          released: jobs.filter((job) => job.status === 3).length,
          running: jobs.filter((job) => job.status === 4).length,
          blockers: exceptions.filter((exception) => exception.status === 1 || exception.status === 2).length
        });
      })
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load dispatch context.")));
  }, []);

  return (
    <>
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <OperationsHubPage
        eyebrow="Dispatch Control"
        title="Dispatch Center"
        description="The backend currently exposes dispatch actions per queue item instead of a flat queue listing endpoint. This page gives a live control summary from schedule jobs and open exceptions so planners can pivot into scheduling, calendars, and job detail flows."
        stats={[
          { label: "Jobs in Focus", value: stats.jobs, tone: "#6366f1" },
          { label: "Released", value: stats.released, tone: "#2563eb" },
          { label: "Running", value: stats.running, tone: "#16a34a" },
          { label: "Open Blockers", value: stats.blockers, tone: "#ef4444" }
        ]}
        actions={[
          { title: "Scheduling Board", description: "Review plan and job readiness before dispatching work into execution.", to: "/scheduling", cta: "Open Board" },
          { title: "Shift Windows", description: "Validate dispatch timing against shift coverage and available work windows.", to: "/scheduling/shifts", cta: "Open Shifts" },
          { title: "Calendar Capacity", description: "Use the calendar surface to understand timing and capacity constraints around dispatch.", to: "/scheduling/calendars", cta: "Open Calendars" },
          { title: "Create Schedule Job", description: "Introduce a new job into the scheduling pipeline before release and dispatch.", to: "/scheduling/jobs/new", cta: "New Job" }
        ]}
      />
    </>
  );
}
