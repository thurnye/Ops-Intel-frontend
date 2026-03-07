import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthSession, Permission, User } from "@features/auth/types/auth.types";

type AuthState = {
  user: User | null;
  token: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isBootstrapped: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  permissions: [],
  isAuthenticated: false,
  isBootstrapped: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startAuth(state) {
      state.loading = true;
      state.error = null;
    },
    setSession(state, action: PayloadAction<AuthSession>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.permissions = action.payload.permissions;
      state.isAuthenticated = true;
      state.isBootstrapped = true;
      state.loading = false;
      state.error = null;
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSession(state) {
      state.user = null;
      state.token = null;
      state.permissions = [];
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.isBootstrapped = true;
    },
    bootstrapComplete(state) {
      state.isBootstrapped = true;
    }
  }
});

export const { startAuth, setSession, setAuthError, clearSession, bootstrapComplete } = authSlice.actions;
export default authSlice.reducer;
