import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const LoginPage = lazy(() => import("@features/auth/pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const ForgotPasswordPage = lazy(() => import("@features/auth/pages/ForgotPasswordPage").then((module) => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("@features/auth/pages/ResetPasswordPage").then((module) => ({ default: module.ResetPasswordPage })));
const UnauthorizedPage = lazy(() => import("@features/auth/pages/UnauthorizedPage").then((module) => ({ default: module.UnauthorizedPage })));

export function AuthRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading authentication..." />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </Suspense>
  );
}
