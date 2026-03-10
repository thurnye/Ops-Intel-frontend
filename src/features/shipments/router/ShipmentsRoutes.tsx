import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const ShipmentsListPage = lazy(() => import("@features/shipments/pages/ShipmentsListPage").then((module) => ({ default: module.ShipmentsListPage })));
const ShipmentDetailsPage = lazy(() => import("@features/shipments/pages/ShipmentDetailsPage").then((module) => ({ default: module.ShipmentDetailsPage })));

export function ShipmentsRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading shipments..." />}>
      <Routes>
        <Route index element={<ShipmentsListPage />} />
        <Route path=":shipmentId" element={<ShipmentDetailsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
