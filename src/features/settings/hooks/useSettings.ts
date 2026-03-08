import { useAppSelector } from "@app/hooks/app.hooks";

export function useSettings() {
  return useAppSelector((s) => s.settings);
}
