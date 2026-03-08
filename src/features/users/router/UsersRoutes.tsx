import { Navigate, Route, Routes } from "react-router-dom";
import { UsersListPage } from "@features/users/pages/UsersListPage";
import { UserDetailsPage } from "@features/users/pages/UserDetailsPage";

export function UsersRoutes() {
  return (
    <Routes>
      <Route index element={<UsersListPage />} />
      <Route path=":userId" element={<UserDetailsPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
