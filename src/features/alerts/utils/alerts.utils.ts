import type { AlertSeverity } from "@features/alerts/types/alerts.types";

export function severityColor(severity: AlertSeverity): "error" | "warning" | "info" | "default" {
  const map: Record<AlertSeverity, "error" | "warning" | "info" | "default"> = {
    critical: "error", high: "error", medium: "warning", low: "info"
  };
  return map[severity];
}

export function severityLabel(severity: AlertSeverity): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
