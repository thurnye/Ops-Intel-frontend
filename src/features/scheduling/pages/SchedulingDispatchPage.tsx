import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { OperationsHubPage } from "@app/components/OperationsHubPage";
import { schedulingApi } from "@features/scheduling/services/scheduling.api.service";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function SchedulingDispatchPage() {
  const [stats, setStats] = useState({ jobs: 0, released: 0, running: 0, blockers: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void schedulingApi.getDispatchSummary()
      .then((summaryResponse) => {
        const summary = getApiData(summaryResponse, { totalJobs: 0, releasedJobs: 0, runningJobs: 0, openBlockers: 0 });
        setStats({
          jobs: summary.totalJobs,
          released: summary.releasedJobs,
          running: summary.runningJobs,
          blockers: summary.openBlockers
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
        highlights={[
          `${stats.released} jobs are ready to move`,
          `${stats.running} jobs are already consuming capacity`,
          `${stats.blockers} open blockers are constraining dispatch decisions`
        ]}
        stats={[
          { label: "Jobs in Focus", value: stats.jobs, tone: "#6366f1", description: "Jobs currently contributing to dispatch context from the live schedule." },
          { label: "Released", value: stats.released, tone: "#2563eb", description: "Jobs available for release or next-stage dispatch action." },
          { label: "Running", value: stats.running, tone: "#16a34a", description: "Jobs already in active execution and consuming work-center capacity." },
          { label: "Open Blockers", value: stats.blockers, tone: "#ef4444", description: "Exceptions still unresolved and capable of stopping dispatch decisions." }
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
