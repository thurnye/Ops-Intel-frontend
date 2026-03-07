import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@app/routes/AppShell";
import { AuthRoutes } from "@features/auth/router/AuthRoutes";
import { ProtectedRoute } from "@features/auth/router/ProtectedRoute";
import { DashboardRoutes } from "@features/dashboard/router/DashboardRoutes";
import { OrdersRoutes } from "@features/orders/router/OrdersRoutes";
import { InventoryRoutes } from "@features/inventory/router/InventoryRoutes";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/*" element={<AuthRoutes />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
          <Route path="/orders/*" element={<OrdersRoutes />} />
          <Route path="/inventory/*" element={<InventoryRoutes />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  );
}
