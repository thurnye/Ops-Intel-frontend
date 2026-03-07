import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@features/auth/pages/LoginPage";
import { ForgotPasswordPage } from "@features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@features/auth/pages/ResetPasswordPage";
import { UnauthorizedPage } from "@features/auth/pages/UnauthorizedPage";

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}
