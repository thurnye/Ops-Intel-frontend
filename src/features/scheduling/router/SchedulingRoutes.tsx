import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const ScheduleBoardPage = lazy(() => import("@features/scheduling/pages/ScheduleBoardPage").then((module) => ({ default: module.ScheduleBoardPage })));
const ScheduleCalendarPage = lazy(() => import("@features/scheduling/pages/ScheduleCalendarPage").then((module) => ({ default: module.ScheduleCalendarPage })));
const SchedulePlanDetailPage = lazy(() => import("@features/scheduling/pages/SchedulePlanDetailPage").then((module) => ({ default: module.SchedulePlanDetailPage })));
const ScheduleJobDetailPage = lazy(() => import("@features/scheduling/pages/ScheduleJobDetailPage").then((module) => ({ default: module.ScheduleJobDetailPage })));

export function SchedulingRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading scheduling..." />}>
      <Routes>
        <Route index element={<ScheduleBoardPage />} />
        <Route path="calendar" element={<ScheduleCalendarPage />} />
        <Route path="plans/:planId" element={<SchedulePlanDetailPage />} />
        <Route path="jobs/:jobId" element={<ScheduleJobDetailPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
