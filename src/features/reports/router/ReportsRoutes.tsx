import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const ReportsHomePage = lazy(() => import("@features/reports/pages/ReportsHomePage").then((module) => ({ default: module.ReportsHomePage })));

export function ReportsRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading reports..." />}>
      <Routes>
        <Route index element={<ReportsHomePage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
