import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const AlertsCenterPage = lazy(() => import("@features/alerts/pages/AlertsCenterPage").then((module) => ({ default: module.AlertsCenterPage })));
const AlertDetailsPage = lazy(() => import("@features/alerts/pages/AlertDetailsPage").then((module) => ({ default: module.AlertDetailsPage })));

export function AlertsRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading alerts..." />}>
      <Routes>
        <Route index element={<AlertsCenterPage />} />
        <Route path=":alertId" element={<AlertDetailsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
