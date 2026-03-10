import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const ScheduleBoardPage = lazy(() => import("@features/scheduling/pages/ScheduleBoardPage").then((module) => ({ default: module.ScheduleBoardPage })));
const ScheduleCalendarPage = lazy(() => import("@features/scheduling/pages/ScheduleCalendarPage").then((module) => ({ default: module.ScheduleCalendarPage })));
const SchedulePlanDetailPage = lazy(() => import("@features/scheduling/pages/SchedulePlanDetailPage").then((module) => ({ default: module.SchedulePlanDetailPage })));
const ScheduleJobDetailPage = lazy(() => import("@features/scheduling/pages/ScheduleJobDetailPage").then((module) => ({ default: module.ScheduleJobDetailPage })));
const SchedulePlanEditorPage = lazy(() => import("@features/scheduling/pages/SchedulePlanEditorPage").then((module) => ({ default: module.SchedulePlanEditorPage })));
const ScheduleJobEditorPage = lazy(() => import("@features/scheduling/pages/ScheduleJobEditorPage").then((module) => ({ default: module.ScheduleJobEditorPage })));
const SchedulingShiftsPage = lazy(() => import("@features/scheduling/pages/SchedulingShiftsPage").then((module) => ({ default: module.SchedulingShiftsPage })));
const SchedulingDispatchPage = lazy(() => import("@features/scheduling/pages/SchedulingDispatchPage").then((module) => ({ default: module.SchedulingDispatchPage })));

export function SchedulingRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading scheduling..." />}>
      <Routes>
        <Route index element={<ScheduleBoardPage />} />
        <Route path="overview" element={<Navigate to="/scheduling" replace />} />
        <Route path="calendar" element={<Navigate to="/scheduling/calendars" replace />} />
        <Route path="calendars" element={<ScheduleCalendarPage />} />
        <Route path="shifts" element={<SchedulingShiftsPage />} />
        <Route path="dispatch" element={<SchedulingDispatchPage />} />
        <Route path="plans/new" element={<SchedulePlanEditorPage />} />
        <Route path="plans/:planId/edit" element={<SchedulePlanEditorPage />} />
        <Route path="plans/:planId" element={<SchedulePlanDetailPage />} />
        <Route path="jobs/new" element={<ScheduleJobEditorPage />} />
        <Route path="jobs/:jobId/edit" element={<ScheduleJobEditorPage />} />
        <Route path="jobs/:jobId" element={<ScheduleJobDetailPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
