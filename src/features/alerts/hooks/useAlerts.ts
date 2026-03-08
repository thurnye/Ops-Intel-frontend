import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useAlerts() {
  const { alerts, filters } = useAppSelector((s) => s.alerts);

  const filteredAlerts = useMemo(() => {
    let result = alerts;
    if (!filters.showResolved) result = result.filter((a) => !a.isResolved);
    if (filters.severity) result = result.filter((a) => a.severity === filters.severity);
    if (filters.category) result = result.filter((a) => a.category === filters.category);
    return result;
  }, [alerts, filters]);

  const unreadCount = useMemo(() => alerts.filter((a) => !a.isRead && !a.isResolved).length, [alerts]);

  return { alerts, filteredAlerts, filters, unreadCount };
}
