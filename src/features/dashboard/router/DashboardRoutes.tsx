import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const DashboardOverviewPage = lazy(() => import("@features/dashboard/pages/DashboardOverviewPage").then((module) => ({ default: module.DashboardOverviewPage })));

export function DashboardRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading dashboard..." />}>
      <Routes>
        <Route index element={<DashboardOverviewPage />} />
        <Route path="*" element={<Navigate replace to="." />} />
      </Routes>
    </Suspense>
  );
}
