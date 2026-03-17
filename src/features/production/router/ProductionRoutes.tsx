import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const ProductionOverviewPage = lazy(() => import("@features/production/pages/ProductionOverviewPage").then((module) => ({ default: module.ProductionOverviewPage })));
const ProductionJobDetailsPage = lazy(() => import("@features/production/pages/ProductionJobDetailsPage").then((module) => ({ default: module.ProductionJobDetailsPage })));
const ProductionOrderEditorPage = lazy(() => import("@features/production/pages/ProductionOrderEditorPage").then((module) => ({ default: module.ProductionOrderEditorPage })));
const ProductionRoutingsPage = lazy(() => import("@features/production/pages/ProductionRoutingsPage").then((module) => ({ default: module.ProductionRoutingsPage })));
const ProductionMachinesPage = lazy(() => import("@features/production/pages/ProductionMachinesPage").then((module) => ({ default: module.ProductionMachinesPage })));
const ProductionMachinesBulkImportPage = lazy(() => import("@features/production/pages/ProductionMachinesBulkImportPage").then((module) => ({ default: module.ProductionMachinesBulkImportPage })));
const ProductionLaborLogsPage = lazy(() => import("@features/production/pages/ProductionLaborLogsPage").then((module) => ({ default: module.ProductionLaborLogsPage })));

export function ProductionRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading production..." />}>
      <Routes>
        <Route index element={<ProductionOverviewPage />} />
        <Route path="overview" element={<Navigate to="/production" replace />} />
        <Route path="routings" element={<ProductionRoutingsPage />} />
        <Route path="machines" element={<ProductionMachinesPage />} />
        <Route path="machines/bulk-import" element={<ProductionMachinesBulkImportPage />} />
        <Route path="labor-logs" element={<ProductionLaborLogsPage />} />
        <Route path="new" element={<ProductionOrderEditorPage />} />
        <Route path=":orderId/edit" element={<ProductionOrderEditorPage />} />
        <Route path=":orderId" element={<ProductionJobDetailsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
