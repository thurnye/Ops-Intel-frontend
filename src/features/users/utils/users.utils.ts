import type { UserRole, UserStatus } from "@features/users/types/users.types";

export function roleLabel(role: UserRole): string {
  const map: Record<UserRole, string> = { admin: "Admin", leader: "Leader", planner: "Planner", operator: "Operator" };
  return map[role];
}

export function roleColor(role: UserRole): "error" | "primary" | "info" | "default" {
  const map: Record<UserRole, "error" | "primary" | "info" | "default"> = { admin: "error", leader: "primary", planner: "info", operator: "default" };
  return map[role];
}

export function statusColor(status: UserStatus): "success" | "default" {
  return status === "active" ? "success" : "default";
}
