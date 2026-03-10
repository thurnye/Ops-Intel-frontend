import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const SettingsHomePage = lazy(() => import("@features/settings/pages/SettingsHomePage").then((module) => ({ default: module.SettingsHomePage })));
const SettingsProfilePage = lazy(() => import("@features/settings/pages/SettingsProfilePage").then((module) => ({ default: module.SettingsProfilePage })));
const SettingsPreferencesPage = lazy(() => import("@features/settings/pages/SettingsPreferencesPage").then((module) => ({ default: module.SettingsPreferencesPage })));
const SettingsThresholdsPage = lazy(() => import("@features/settings/pages/SettingsThresholdsPage").then((module) => ({ default: module.SettingsThresholdsPage })));

export function SettingsRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading settings..." />}>
      <Routes>
        <Route index element={<SettingsHomePage />} />
        <Route path="profile" element={<SettingsProfilePage />} />
        <Route path="preferences" element={<SettingsPreferencesPage />} />
        <Route path="thresholds" element={<SettingsThresholdsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
