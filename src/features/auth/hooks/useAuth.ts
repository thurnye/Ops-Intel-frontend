import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@app/hooks/app.hooks";
import { startAuth, setAuth, setAuthError, clearAuth } from "@features/auth/redux/slices/auth.slice";
import { authApi } from "@features/auth/services/auth.api.service";
import type { LoginRequest, RegisterRequest } from "@features/auth/types/auth.types";

export function useAuth() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const hasRole = useCallback((role: string) => auth.user?.roles.includes(role) ?? false, [auth.user]);
  const hasPermission = useCallback((permission: string) => auth.user?.permissions.includes(permission) ?? false, [auth.user]);

  const login = useCallback(async (payload: LoginRequest) => {
    dispatch(startAuth());
    try {
      const response = await authApi.login(payload);
      if (response.data) {
        const { accessToken, accessTokenExpiresAtUtc, user } = response.data;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("access_token_expires", accessTokenExpiresAtUtc);
        dispatch(setAuth({ user, accessToken, accessTokenExpiresAtUtc }));
        return true;
      }
      const msg = response.errors?.[0]?.message ?? "Login failed";
      dispatch(setAuthError(msg));
      return false;
    } catch (err: unknown) {
      const message = (err as { errors?: { message: string }[] })?.errors?.[0]?.message ?? "Login failed. Please try again.";
      dispatch(setAuthError(message));
      return false;
    }
  }, [dispatch]);

  const register = useCallback(async (payload: RegisterRequest) => {
    dispatch(startAuth());
    try {
      const response = await authApi.register(payload);
      if (response.data) {
        const { accessToken, accessTokenExpiresAtUtc, user } = response.data;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("access_token_expires", accessTokenExpiresAtUtc);
        dispatch(setAuth({ user, accessToken, accessTokenExpiresAtUtc }));
        return true;
      }
      const msg = response.errors?.[0]?.message ?? "Registration failed";
      dispatch(setAuthError(msg));
      return false;
    } catch (err: unknown) {
      const message = (err as { errors?: { message: string }[] })?.errors?.[0]?.message ?? "Registration failed. Please try again.";
      dispatch(setAuthError(message));
      return false;
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout API errors
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_token_expires");
    dispatch(clearAuth());
  }, [dispatch]);

  return {
    ...auth,
    hasRole,
    hasPermission,
    login,
    register,
    logout
  };
}
