import { Navigate, Route, Routes } from "react-router-dom";
import { SettingsHomePage } from "@features/settings/pages/SettingsHomePage";
import { SettingsProfilePage } from "@features/settings/pages/SettingsProfilePage";
import { SettingsPreferencesPage } from "@features/settings/pages/SettingsPreferencesPage";
import { SettingsThresholdsPage } from "@features/settings/pages/SettingsThresholdsPage";

export function SettingsRoutes() {
  return (
    <Routes>
      <Route index element={<SettingsHomePage />} />
      <Route path="profile" element={<SettingsProfilePage />} />
      <Route path="preferences" element={<SettingsPreferencesPage />} />
      <Route path="thresholds" element={<SettingsThresholdsPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
