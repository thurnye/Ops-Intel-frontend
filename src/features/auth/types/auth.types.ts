export type Role = "admin" | "leader" | "planner" | "operator";

export type Permission =
  | "dashboard:view"
  | "orders:view"
  | "inventory:view"
  | "orders:edit"
  | "users:manage";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthSession = {
  user: User;
  token: string;
  permissions: Permission[];
};
