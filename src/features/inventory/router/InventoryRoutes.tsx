import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const InventoryOverviewPage = lazy(() => import("@features/inventory/pages/InventoryOverviewPage").then((module) => ({ default: module.InventoryOverviewPage })));
const InventoryItemDetailsPage = lazy(() => import("@features/inventory/pages/InventoryItemDetailsPage").then((module) => ({ default: module.InventoryItemDetailsPage })));
const InventoryItemEditorPage = lazy(() => import("@features/inventory/pages/InventoryItemEditorPage").then((module) => ({ default: module.InventoryItemEditorPage })));
const InventoryTransactionsPage = lazy(() => import("@features/inventory/pages/InventoryTransactionsPage").then((module) => ({ default: module.InventoryTransactionsPage })));
const InventoryBrandsPage = lazy(() => import("@features/inventory/pages/InventoryBrandsPage").then((module) => ({ default: module.InventoryBrandsPage })));
const InventoryWarehousesPage = lazy(() => import("@features/inventory/pages/InventoryWarehousesPage").then((module) => ({ default: module.InventoryWarehousesPage })));
const InventorySuppliersPage = lazy(() => import("@features/inventory/pages/InventorySuppliersPage").then((module) => ({ default: module.InventorySuppliersPage })));

export function InventoryRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading inventory..." />}>
      <Routes>
        <Route index element={<InventoryOverviewPage />} />
        <Route path="overview" element={<Navigate replace to="/inventory" />} />
        <Route path="catalogs" element={<InventoryOverviewPage />} />
        <Route path="brands" element={<InventoryBrandsPage />} />
        <Route path="warehouses" element={<InventoryWarehousesPage />} />
        <Route path="suppliers" element={<InventorySuppliersPage />} />
        <Route path="new" element={<InventoryItemEditorPage />} />
        <Route path=":itemId/edit" element={<InventoryItemEditorPage />} />
        <Route path=":itemId" element={<InventoryItemDetailsPage />} />
        <Route path="movements" element={<InventoryTransactionsPage />} />
        <Route path="transactions" element={<Navigate replace to="/inventory/movements" />} />
        <Route path="*" element={<Navigate replace to="." />} />
      </Routes>
    </Suspense>
  );
}
