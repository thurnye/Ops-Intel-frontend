import { useAppDispatch, useAppSelector } from "@app/hooks/app.hooks";
import { setSelectedRange, setSelectedSite } from "@features/dashboard/redux/slices/dashboard.slice";

export function useDashboard() {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector((state) => state.dashboard);

  return {
    ...dashboard,
    onRangeChange: (value: string) => dispatch(setSelectedRange(value)),
    onSiteChange: (value: string) => dispatch(setSelectedSite(value)),
  };
}
