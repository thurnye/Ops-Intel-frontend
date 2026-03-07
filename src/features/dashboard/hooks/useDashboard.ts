import { useAppSelector } from "@app/hooks/app.hooks";

export function useDashboard() {
  return useAppSelector((state) => state.dashboard);
}
