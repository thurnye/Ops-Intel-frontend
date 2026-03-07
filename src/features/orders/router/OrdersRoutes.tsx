import { Navigate, Route, Routes } from "react-router-dom";
import { OrdersListPage } from "@features/orders/pages/OrdersListPage";
import { OrderDetailsPage } from "@features/orders/pages/OrderDetailsPage";
import { OrderEditorPage } from "@features/orders/pages/OrderEditorPage";
import { OrderTrackingPage } from "@features/orders/pages/OrderTrackingPage";

export function OrdersRoutes() {
  return (
    <Routes>
      <Route index element={<OrdersListPage />} />
      <Route path="new" element={<OrderEditorPage />} />
      <Route path=":orderId" element={<OrderDetailsPage />} />
      <Route path=":orderId/tracking" element={<OrderTrackingPage />} />
      <Route path="*" element={<Navigate replace to="." />} />
    </Routes>
  );
}
