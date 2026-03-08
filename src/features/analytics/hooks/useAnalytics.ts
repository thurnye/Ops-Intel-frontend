import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useAnalytics() {
  const { datasets, filters } = useAppSelector((s) => s.analytics);
  const filteredDatasets = useMemo(() => {
    if (!filters.category) return datasets;
    return datasets.filter((d) => d.category === filters.category);
  }, [datasets, filters]);
  return { datasets, filteredDatasets, filters };
}
