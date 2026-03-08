import { Navigate, Route, Routes } from "react-router-dom";
import { ScheduleBoardPage } from "@features/scheduling/pages/ScheduleBoardPage";
import { ScheduleCalendarPage } from "@features/scheduling/pages/ScheduleCalendarPage";

export function SchedulingRoutes() {
  return (
    <Routes>
      <Route index element={<ScheduleBoardPage />} />
      <Route path="calendar" element={<ScheduleCalendarPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
