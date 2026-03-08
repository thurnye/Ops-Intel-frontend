import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppPreferences, ThresholdConfig, UserProfile } from "@features/settings/types/settings.types";
import { preferencesMock, profileMock, thresholdsMock } from "@features/settings/mock/settings.mock";

type SettingsState = { profile: UserProfile; preferences: AppPreferences; thresholds: ThresholdConfig[]; loading: boolean };

const initialState: SettingsState = { profile: profileMock, preferences: preferencesMock, thresholds: thresholdsMock, loading: false };

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile>) { state.profile = action.payload; },
    setPreferences(state, action: PayloadAction<AppPreferences>) { state.preferences = action.payload; },
    setThresholds(state, action: PayloadAction<ThresholdConfig[]>) { state.thresholds = action.payload; }
  }
});

export const { setProfile, setPreferences, setThresholds } = settingsSlice.actions;
export default settingsSlice.reducer;
