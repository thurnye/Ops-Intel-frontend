export type NotificationPreference = "all" | "critical" | "none";

export type UserProfile = { name: string; email: string; department: string; timezone: string };

export type AppPreferences = { notifications: NotificationPreference; dashboardDefault: "overview" | "analytics"; compactMode: boolean };

export type ThresholdConfig = { id: string; label: string; value: number; unit: string };
