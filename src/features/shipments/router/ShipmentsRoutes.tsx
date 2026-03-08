import { Navigate, Route, Routes } from "react-router-dom";
import { ShipmentsListPage } from "@features/shipments/pages/ShipmentsListPage";
import { ShipmentDetailsPage } from "@features/shipments/pages/ShipmentDetailsPage";

export function ShipmentsRoutes() {
  return (
    <Routes>
      <Route index element={<ShipmentsListPage />} />
      <Route path=":shipmentId" element={<ShipmentDetailsPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
