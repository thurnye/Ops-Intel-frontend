import type { NotificationPreference } from "@features/settings/types/settings.types";

export function notificationLabel(pref: NotificationPreference): string {
  const map: Record<NotificationPreference, string> = { all: "All Notifications", critical: "Critical Only", none: "None" };
  return map[pref];
}
