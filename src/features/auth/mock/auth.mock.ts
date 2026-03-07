import type { AuthSession } from "@features/auth/types/auth.types";

export const mockSession: AuthSession = {
  user: {
    id: "u-001",
    name: "Operations Supervisor",
    email: "ops.supervisor@canart.local",
    role: "leader"
  },
  token: "demo-token",
  permissions: ["dashboard:view", "orders:view", "inventory:view", "orders:edit"]
};
