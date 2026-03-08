import { Navigate, Route, Routes } from "react-router-dom";
import { AlertsCenterPage } from "@features/alerts/pages/AlertsCenterPage";
import { AlertDetailsPage } from "@features/alerts/pages/AlertDetailsPage";

export function AlertsRoutes() {
  return (
    <Routes>
      <Route index element={<AlertsCenterPage />} />
      <Route path=":alertId" element={<AlertDetailsPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
