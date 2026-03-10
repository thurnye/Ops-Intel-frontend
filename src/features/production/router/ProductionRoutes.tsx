import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const ProductionOverviewPage = lazy(() => import("@features/production/pages/ProductionOverviewPage").then((module) => ({ default: module.ProductionOverviewPage })));
const ProductionJobDetailsPage = lazy(() => import("@features/production/pages/ProductionJobDetailsPage").then((module) => ({ default: module.ProductionJobDetailsPage })));

export function ProductionRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading production..." />}>
      <Routes>
        <Route index element={<ProductionOverviewPage />} />
        <Route path=":orderId" element={<ProductionJobDetailsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
