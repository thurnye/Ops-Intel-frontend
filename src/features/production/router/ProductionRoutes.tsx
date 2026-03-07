import { Navigate, Route, Routes } from "react-router-dom";
import { ProductionOverviewPage } from "@features/production/pages/ProductionOverviewPage";

export function ProductionRoutes() {
  return (
    <Routes>
      <Route index element={<ProductionOverviewPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
