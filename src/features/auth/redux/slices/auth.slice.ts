import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@features/auth/types/auth.types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  accessTokenExpiresAtUtc: string | null;
  isAuthenticated: boolean;
  isBootstrapped: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  accessTokenExpiresAtUtc: null,
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
    setAuth(state, action: PayloadAction<{ user: User; accessToken: string; accessTokenExpiresAtUtc: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.accessTokenExpiresAtUtc = action.payload.accessTokenExpiresAtUtc;
      state.isAuthenticated = true;
      state.isBootstrapped = true;
      state.loading = false;
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.accessTokenExpiresAtUtc = null;
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

export const { startAuth, setAuth, setUser, setAuthError, clearAuth, bootstrapComplete } = authSlice.actions;
export default authSlice.reducer;
