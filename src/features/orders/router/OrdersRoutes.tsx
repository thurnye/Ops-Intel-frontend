import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const OrdersListPage = lazy(() => import("@features/orders/pages/OrdersListPage").then((module) => ({ default: module.OrdersListPage })));
const OrderDetailsPage = lazy(() => import("@features/orders/pages/OrderDetailsPage").then((module) => ({ default: module.OrderDetailsPage })));
const OrderEditorPage = lazy(() => import("@features/orders/pages/OrderEditorPage").then((module) => ({ default: module.OrderEditorPage })));
const OrderTrackingPage = lazy(() => import("@features/orders/pages/OrderTrackingPage").then((module) => ({ default: module.OrderTrackingPage })));

export function OrdersRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading orders..." />}>
      <Routes>
        <Route index element={<OrdersListPage />} />
        <Route path="new" element={<OrderEditorPage />} />
        <Route path=":orderId" element={<OrderDetailsPage />} />
        <Route path=":orderId/tracking" element={<OrderTrackingPage />} />
        <Route path="*" element={<Navigate replace to="." />} />
      </Routes>
    </Suspense>
  );
}
