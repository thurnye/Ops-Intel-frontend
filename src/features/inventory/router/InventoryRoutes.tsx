import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const InventoryOverviewPage = lazy(() => import("@features/inventory/pages/InventoryOverviewPage").then((module) => ({ default: module.InventoryOverviewPage })));
const InventoryItemDetailsPage = lazy(() => import("@features/inventory/pages/InventoryItemDetailsPage").then((module) => ({ default: module.InventoryItemDetailsPage })));
const InventoryTransactionsPage = lazy(() => import("@features/inventory/pages/InventoryTransactionsPage").then((module) => ({ default: module.InventoryTransactionsPage })));

export function InventoryRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading inventory..." />}>
      <Routes>
        <Route index element={<InventoryOverviewPage />} />
        <Route path=":itemId" element={<InventoryItemDetailsPage />} />
        <Route path="movements" element={<InventoryTransactionsPage />} />
        <Route path="transactions" element={<Navigate replace to="/inventory/movements" />} />
        <Route path="*" element={<Navigate replace to="." />} />
      </Routes>
    </Suspense>
  );
}
