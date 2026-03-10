import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const UsersListPage = lazy(() => import("@features/users/pages/UsersListPage").then((module) => ({ default: module.UsersListPage })));
const UserDetailsPage = lazy(() => import("@features/users/pages/UserDetailsPage").then((module) => ({ default: module.UserDetailsPage })));

export function UsersRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading users..." />}>
      <Routes>
        <Route index element={<UsersListPage />} />
        <Route path=":userId" element={<UserDetailsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
