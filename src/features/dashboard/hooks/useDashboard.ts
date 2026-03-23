import { useAppDispatch, useAppSelector } from "@app/hooks/app.hooks";
import type { DashboardDateFilterValue } from "@features/dashboard/components/Date/DashboardDateFilter";
import { setDateFilter, setSelectedSite } from "@features/dashboard/redux/slices/dashboard.slice";

export function useDashboard() {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector((state) => state.dashboard);

  return {
    ...dashboard,
    onSiteChange: (value: string) => dispatch(setSelectedSite(value)),
    onDateFilterChange: (value: DashboardDateFilterValue) =>
      dispatch(setDateFilter(value)),
  };
}
