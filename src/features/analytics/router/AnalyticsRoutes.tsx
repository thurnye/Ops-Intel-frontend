import { Navigate, Route, Routes } from "react-router-dom";
import { AnalyticsOverviewPage } from "@features/analytics/pages/AnalyticsOverviewPage";

export function AnalyticsRoutes() {
  return (
    <Routes>
      <Route index element={<AnalyticsOverviewPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
