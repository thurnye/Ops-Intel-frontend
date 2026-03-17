import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks/app.hooks";
import { setAnalyticsFilters } from "@features/analytics/redux/slices/analytics.slice";

export function useAnalytics() {
  const dispatch = useAppDispatch();
  const analytics = useAppSelector((s) => s.analytics);

  const activeCategory = useMemo(() => analytics.filters.category, [analytics.filters.category]);

  return {
    ...analytics,
    activeCategory,
    onFiltersChange: (filters: typeof analytics.filters) => dispatch(setAnalyticsFilters(filters)),
  };
}
