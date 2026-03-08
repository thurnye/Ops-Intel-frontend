import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";

export function useUsers() {
  const { users, filters } = useAppSelector((s) => s.users);
  const filteredUsers = useMemo(() => {
    let result = users;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (filters.role) result = result.filter((u) => u.role === filters.role);
    if (filters.status) result = result.filter((u) => u.status === filters.status);
    return result;
  }, [users, filters]);
  return { users, filteredUsers, filters };
}
