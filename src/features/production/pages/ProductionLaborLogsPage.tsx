import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { OperationsHubPage } from "@app/components/OperationsHubPage";
import { productionApi } from "@features/production/services/production.api.service";
import { getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";

export function ProductionLaborLogsPage() {
  const [stats, setStats] = useState({ executions: 0, running: 0, paused: 0, completed: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void productionApi.listExecutions({ pageNumber: 1, pageSize: 100 })
      .then((response) => {
        const executions = getPagedItems(response);
        setStats({
          executions: executions.length,
          running: executions.filter((execution) => execution.status === 3).length,
          paused: executions.filter((execution) => execution.status === 4).length,
          completed: executions.filter((execution) => execution.status === 5).length
        });
      })
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load labor log context.")));
  }, []);

  return (
    <>
      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}
      <OperationsHubPage
        eyebrow="Execution Labor"
        title="Labor Logs"
        description="Labor logging in the current backend is tied to production executions, not a flat global registry. Use this section as the control point to monitor active execution volume and move into production orders or execution workflows for labor capture."
        stats={[
          { label: "Executions", value: stats.executions, tone: "#6366f1" },
          { label: "Running", value: stats.running, tone: "#16a34a" },
          { label: "Paused", value: stats.paused, tone: "#f59e0b" },
          { label: "Completed", value: stats.completed, tone: "#475569" }
        ]}
        actions={[
          { title: "Active Production Orders", description: "Jump into the production overview to find the orders currently generating execution and labor activity.", to: "/production", cta: "Open Overview" },
          { title: "Machine Context", description: "Cross-check labor against the machine estate and work-center readiness.", to: "/production/machines", cta: "Open Machines" },
          { title: "Routing Context", description: "Review the operation path that frames how labor should be sequenced and assigned.", to: "/production/routings", cta: "Open Routings" },
          { title: "Create Production Order", description: "Start a new production record that can later generate execution and labor events.", to: "/production/new", cta: "New Order" }
        ]}
      />
    </>
  );
}
