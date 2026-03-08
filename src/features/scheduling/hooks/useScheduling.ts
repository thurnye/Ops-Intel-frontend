import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useScheduling() {
  const { entries, filters } = useAppSelector((s) => s.scheduling);

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (e) => e.id.toLowerCase().includes(q) || e.product.toLowerCase().includes(q) || e.jobId.toLowerCase().includes(q)
      );
    }
    if (filters.line) result = result.filter((e) => e.line === filters.line);
    if (filters.status) result = result.filter((e) => e.status === filters.status);
    return result;
  }, [entries, filters]);

  return { entries, filteredEntries, filters };
}
