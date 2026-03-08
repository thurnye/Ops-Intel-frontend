import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useProduction() {
  const { workOrders, filters } = useAppSelector((s) => s.production);

  const filteredJobs = useMemo(() => {
    let result = workOrders;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (j) => j.id.toLowerCase().includes(q) || j.product.toLowerCase().includes(q) || j.line.toLowerCase().includes(q)
      );
    }
    if (filters.status) result = result.filter((j) => j.status === filters.status);
    if (filters.line) result = result.filter((j) => j.line === filters.line);
    return result;
  }, [workOrders, filters]);

  return { workOrders, filteredJobs, filters };
}
