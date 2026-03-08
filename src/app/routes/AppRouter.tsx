import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@app/routes/AppShell";
import { AuthRoutes } from "@features/auth/router/AuthRoutes";
import { ProtectedRoute } from "@features/auth/router/ProtectedRoute";
import { DashboardRoutes } from "@features/dashboard/router/DashboardRoutes";
import { OrdersRoutes } from "@features/orders/router/OrdersRoutes";
import { InventoryRoutes } from "@features/inventory/router/InventoryRoutes";
import { ProductionRoutes } from "@features/production/router/ProductionRoutes";
import { SchedulingRoutes } from "@features/scheduling/router/SchedulingRoutes";
import { ShipmentsRoutes } from "@features/shipments/router/ShipmentsRoutes";
import { ReportsRoutes } from "@features/reports/router/ReportsRoutes";
import { AnalyticsRoutes } from "@features/analytics/router/AnalyticsRoutes";
import { AlertsRoutes } from "@features/alerts/router/AlertsRoutes";
import { UsersRoutes } from "@features/users/router/UsersRoutes";
import { SettingsRoutes } from "@features/settings/router/SettingsRoutes";

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
          <Route path="/production/*" element={<ProductionRoutes />} />
          <Route path="/scheduling/*" element={<SchedulingRoutes />} />
          <Route path="/shipments/*" element={<ShipmentsRoutes />} />
          <Route path="/reports/*" element={<ReportsRoutes />} />
          <Route path="/analytics/*" element={<AnalyticsRoutes />} />
          <Route path="/alerts/*" element={<AlertsRoutes />} />
          <Route path="/users/*" element={<UsersRoutes />} />
          <Route path="/settings/*" element={<SettingsRoutes />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  );
}
