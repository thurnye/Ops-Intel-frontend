import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const ShipmentsOverviewPage = lazy(() => import("@features/shipments/pages/ShipmentsOverviewPage").then((module) => ({ default: module.ShipmentsOverviewPage })));
const ShipmentsListPage = lazy(() => import("@features/shipments/pages/ShipmentsListPage").then((module) => ({ default: module.ShipmentsListPage })));
const ShipmentDetailsPage = lazy(() => import("@features/shipments/pages/ShipmentDetailsPage").then((module) => ({ default: module.ShipmentDetailsPage })));
const ShipmentEditorPage = lazy(() => import("@features/shipments/pages/ShipmentEditorPage").then((module) => ({ default: module.ShipmentEditorPage })));
const ShipmentsCarriersPage = lazy(() => import("@features/shipments/pages/ShipmentsCarriersPage").then((module) => ({ default: module.ShipmentsCarriersPage })));
const ShipmentLanesPage = lazy(() => import("@features/shipments/pages/ShipmentLanesPage").then((module) => ({ default: module.ShipmentLanesPage })));

export function ShipmentsRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading shipments..." />}>
      <Routes>
        <Route index element={<ShipmentsOverviewPage />} />
        <Route path="overview" element={<Navigate to="/shipments" replace />} />
        <Route path="records" element={<ShipmentsListPage />} />
        <Route path="carriers" element={<ShipmentsCarriersPage />} />
        <Route path="lanes" element={<ShipmentLanesPage />} />
        <Route path="new" element={<ShipmentEditorPage />} />
        <Route path=":shipmentId/edit" element={<ShipmentEditorPage />} />
        <Route path=":shipmentId" element={<ShipmentDetailsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
