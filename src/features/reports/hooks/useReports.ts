import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useReports() {
  const { reports, filters } = useAppSelector((s) => s.reports);
  const filteredReports = useMemo(() => {
    if (!filters.type) return reports;
    return reports.filter((r) => r.type === filters.type);
  }, [reports, filters]);
  return { reports, filteredReports, filters };
}
