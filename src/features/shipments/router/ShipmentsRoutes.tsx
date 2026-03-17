import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const ShipmentsOverviewPage = lazy(() => import("@features/shipments/pages/ShipmentsOverviewPage").then((module) => ({ default: module.ShipmentsOverviewPage })));
const ShipmentsListPage = lazy(() => import("@features/shipments/pages/ShipmentsListPage").then((module) => ({ default: module.ShipmentsListPage })));
const ShipmentsBulkImportPage = lazy(() => import("@features/shipments/pages/ShipmentsBulkImportPage").then((module) => ({ default: module.ShipmentsBulkImportPage })));
const ShipmentDetailsPage = lazy(() => import("@features/shipments/pages/ShipmentDetailsPage").then((module) => ({ default: module.ShipmentDetailsPage })));
const ShipmentEditorPage = lazy(() => import("@features/shipments/pages/ShipmentEditorPage").then((module) => ({ default: module.ShipmentEditorPage })));
const ShipmentsCarriersPage = lazy(() => import("@features/shipments/pages/ShipmentsCarriersPage").then((module) => ({ default: module.ShipmentsCarriersPage })));
const ShipmentsCarriersBulkImportPage = lazy(() => import("@features/shipments/pages/ShipmentsCarriersBulkImportPage").then((module) => ({ default: module.ShipmentsCarriersBulkImportPage })));
const ShipmentLanesPage = lazy(() => import("@features/shipments/pages/ShipmentLanesPage").then((module) => ({ default: module.ShipmentLanesPage })));
const ShipmentLanesBulkImportPage = lazy(() => import("@features/shipments/pages/ShipmentLanesBulkImportPage").then((module) => ({ default: module.ShipmentLanesBulkImportPage })));

export function ShipmentsRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading shipments..." />}>
      <Routes>
        <Route index element={<ShipmentsOverviewPage />} />
        <Route path="overview" element={<Navigate to="/shipments" replace />} />
        <Route path="records" element={<ShipmentsListPage />} />
        <Route path="records/bulk-import" element={<ShipmentsBulkImportPage />} />
        <Route path="carriers" element={<ShipmentsCarriersPage />} />
        <Route path="carriers/bulk-import" element={<ShipmentsCarriersBulkImportPage />} />
        <Route path="lanes" element={<ShipmentLanesPage />} />
        <Route path="lanes/bulk-import" element={<ShipmentLanesBulkImportPage />} />
        <Route path="new" element={<ShipmentEditorPage />} />
        <Route path=":shipmentId/edit" element={<ShipmentEditorPage />} />
        <Route path=":shipmentId" element={<ShipmentDetailsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
