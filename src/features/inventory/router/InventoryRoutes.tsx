import { Navigate, Route, Routes } from "react-router-dom";
import { InventoryOverviewPage } from "@features/inventory/pages/InventoryOverviewPage";
import { InventoryItemDetailsPage } from "@features/inventory/pages/InventoryItemDetailsPage";
import { InventoryTransactionsPage } from "@features/inventory/pages/InventoryTransactionsPage";

export function InventoryRoutes() {
  return (
    <Routes>
      <Route index element={<InventoryOverviewPage />} />
      <Route path=":itemId" element={<InventoryItemDetailsPage />} />
      <Route path="transactions" element={<InventoryTransactionsPage />} />
      <Route path="*" element={<Navigate replace to="." />} />
    </Routes>
  );
}
