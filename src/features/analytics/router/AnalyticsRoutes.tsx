import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const AnalyticsOverviewPage = lazy(() => import("@features/analytics/pages/AnalyticsOverviewPage").then((module) => ({ default: module.AnalyticsOverviewPage })));

export function AnalyticsRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading analytics..." />}>
      <Routes>
        <Route index element={<AnalyticsOverviewPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
