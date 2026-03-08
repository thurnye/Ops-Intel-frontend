import type { AppPreferences, ThresholdConfig, UserProfile } from "@features/settings/types/settings.types";

export const profileMock: UserProfile = { name: "Operations Supervisor", email: "ops.supervisor@canart.local", department: "Operations", timezone: "America/Toronto" };

export const preferencesMock: AppPreferences = { notifications: "all", dashboardDefault: "overview", compactMode: false };

export const thresholdsMock: ThresholdConfig[] = [
  { id: "thr-1", label: "Low Stock Warning", value: 120, unit: "units" },
  { id: "thr-2", label: "Order Delay Threshold", value: 2, unit: "hours" },
  { id: "thr-3", label: "Line Utilization Target", value: 85, unit: "%" },
  { id: "thr-4", label: "On-Time Delivery Target", value: 95, unit: "%" }
];
