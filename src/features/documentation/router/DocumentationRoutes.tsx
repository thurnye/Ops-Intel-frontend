import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteLoading } from "@app/routes/RouteLoading";

const DocumentationHomePage = lazy(() => import("@features/documentation/pages/DocumentationHomePage").then((module) => ({ default: module.DocumentationHomePage })));
const FeatureDocumentationPage = lazy(() => import("@features/documentation/pages/FeatureDocumentationPage").then((module) => ({ default: module.FeatureDocumentationPage })));

export function DocumentationRoutes() {
  return (
    <Suspense fallback={<RouteLoading label="Loading documentation..." />}>
      <Routes>
        <Route index element={<DocumentationHomePage />} />
        <Route path=":feature" element={<FeatureDocumentationPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}
