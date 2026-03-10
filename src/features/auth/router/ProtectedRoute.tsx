import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CircularProgress, Stack } from "@mui/material";
import { useAuth } from "@features/auth/hooks/useAuth";

type Props = {
  permission?: string;
};

export function ProtectedRoute({ permission }: Props) {
  const location = useLocation();
  const { isAuthenticated, isBootstrapped, hasPermission } = useAuth();

  if (!isBootstrapped) {
    return (
      <Stack alignItems="center" className="min-h-screen" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate replace to="/unauthorized" />;
  }

  return <Outlet />;
}
