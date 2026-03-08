import { Navigate, Route, Routes } from "react-router-dom";
import { ProductionOverviewPage } from "@features/production/pages/ProductionOverviewPage";
import { ProductionJobDetailsPage } from "@features/production/pages/ProductionJobDetailsPage";

export function ProductionRoutes() {
  return (
    <Routes>
      <Route index element={<ProductionOverviewPage />} />
      <Route path=":jobId" element={<ProductionJobDetailsPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
