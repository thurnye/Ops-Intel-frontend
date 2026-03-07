import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardOverviewPage } from "@features/dashboard/pages/DashboardOverviewPage";

export function DashboardRoutes() {
  return (
    <Routes>
      <Route index element={<DashboardOverviewPage />} />
      <Route path="*" element={<Navigate replace to="." />} />
    </Routes>
  );
}
