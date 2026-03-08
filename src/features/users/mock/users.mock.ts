import type { AppUser } from "@features/users/types/users.types";

export const usersMock: AppUser[] = [
  { id: "USR-001", name: "Operations Supervisor", email: "ops.supervisor@canart.local", role: "leader", department: "Operations", status: "active", lastActive: "2026-03-07T09:00:00Z" },
  { id: "USR-002", name: "System Admin", email: "admin@canart.local", role: "admin", department: "IT", status: "active", lastActive: "2026-03-07T08:30:00Z" },
  { id: "USR-003", name: "Production Planner", email: "planner@canart.local", role: "planner", department: "Production", status: "active", lastActive: "2026-03-06T17:00:00Z" },
  { id: "USR-004", name: "Line Operator A", email: "operator.a@canart.local", role: "operator", department: "Production", status: "active", lastActive: "2026-03-07T07:00:00Z" },
  { id: "USR-005", name: "Line Operator B", email: "operator.b@canart.local", role: "operator", department: "Production", status: "inactive", lastActive: "2026-02-28T16:00:00Z" },
  { id: "USR-006", name: "Inventory Analyst", email: "inventory@canart.local", role: "planner", department: "Warehouse", status: "active", lastActive: "2026-03-07T08:00:00Z" }
];
