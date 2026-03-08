import { Navigate, Route, Routes } from "react-router-dom";
import { ReportsHomePage } from "@features/reports/pages/ReportsHomePage";

export function ReportsRoutes() {
  return (
    <Routes>
      <Route index element={<ReportsHomePage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
