import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@app/routes/AppShell";
import { ProtectedRoute } from "@features/auth/router/ProtectedRoute";
import { RouteLoading } from "@app/routes/RouteLoading";

const AuthRoutes = lazy(() => import("@features/auth/router/AuthRoutes").then((module) => ({ default: module.AuthRoutes })));
const DashboardRoutes = lazy(() => import("@features/dashboard/router/DashboardRoutes").then((module) => ({ default: module.DashboardRoutes })));
const OrdersRoutes = lazy(() => import("@features/orders/router/OrdersRoutes").then((module) => ({ default: module.OrdersRoutes })));
const InventoryRoutes = lazy(() => import("@features/inventory/router/InventoryRoutes").then((module) => ({ default: module.InventoryRoutes })));
const ProductionRoutes = lazy(() => import("@features/production/router/ProductionRoutes").then((module) => ({ default: module.ProductionRoutes })));
const SchedulingRoutes = lazy(() => import("@features/scheduling/router/SchedulingRoutes").then((module) => ({ default: module.SchedulingRoutes })));
const ShipmentsRoutes = lazy(() => import("@features/shipments/router/ShipmentsRoutes").then((module) => ({ default: module.ShipmentsRoutes })));
const ReportsRoutes = lazy(() => import("@features/reports/router/ReportsRoutes").then((module) => ({ default: module.ReportsRoutes })));
const AnalyticsRoutes = lazy(() => import("@features/analytics/router/AnalyticsRoutes").then((module) => ({ default: module.AnalyticsRoutes })));
const AlertsRoutes = lazy(() => import("@features/alerts/router/AlertsRoutes").then((module) => ({ default: module.AlertsRoutes })));
const UsersRoutes = lazy(() => import("@features/users/router/UsersRoutes").then((module) => ({ default: module.UsersRoutes })));
const SettingsRoutes = lazy(() => import("@features/settings/router/SettingsRoutes").then((module) => ({ default: module.SettingsRoutes })));

export function AppRouter() {
  const renderRoute = (node: React.ReactNode) => (
    <Suspense fallback={<RouteLoading />}>
      {node}
    </Suspense>
  );

  return (
    <Routes>
      <Route path="/*" element={renderRoute(<AuthRoutes />)} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard/*" element={renderRoute(<DashboardRoutes />)} />
          <Route path="/orders/*" element={renderRoute(<OrdersRoutes />)} />
          <Route path="/inventory/*" element={renderRoute(<InventoryRoutes />)} />
          <Route path="/production/*" element={renderRoute(<ProductionRoutes />)} />
          <Route path="/scheduling/*" element={renderRoute(<SchedulingRoutes />)} />
          <Route path="/shipments/*" element={renderRoute(<ShipmentsRoutes />)} />
          <Route path="/reports/*" element={renderRoute(<ReportsRoutes />)} />
          <Route path="/analytics/*" element={renderRoute(<AnalyticsRoutes />)} />
          <Route path="/alerts/*" element={renderRoute(<AlertsRoutes />)} />
          <Route path="/users/*" element={renderRoute(<UsersRoutes />)} />
          <Route path="/settings/*" element={renderRoute(<SettingsRoutes />)} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  );
}
