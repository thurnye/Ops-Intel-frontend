import { useAppSelector } from "@app/hooks/app.hooks";
import type { Permission } from "@features/auth/types/auth.types";

export function useAuth() {
  const auth = useAppSelector((state) => state.auth);

  const hasPermission = (permission: Permission) => auth.permissions.includes(permission);

  return {
    ...auth,
    hasPermission
  };
}
