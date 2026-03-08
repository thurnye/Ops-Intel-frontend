export type UserRole = "admin" | "leader" | "planner" | "operator";
export type UserStatus = "active" | "inactive";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastActive: string;
};

export type UsersFilters = { query: string; role: UserRole | ""; status: UserStatus | "" };
