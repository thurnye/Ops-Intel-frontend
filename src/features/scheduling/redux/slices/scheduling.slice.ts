import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ScheduleEntry, ScheduleFilters } from "@features/scheduling/types/scheduling.types";
import { schedulingMock } from "@features/scheduling/mock/scheduling.mock";

type SchedulingState = {
  entries: ScheduleEntry[];
  filters: ScheduleFilters;
  loading: boolean;
};

const initialState: SchedulingState = {
  entries: schedulingMock,
  filters: { query: "", line: "", status: "" },
  loading: false
};

const schedulingSlice = createSlice({
  name: "scheduling",
  initialState,
  reducers: {
    setScheduleEntries(state, action: PayloadAction<ScheduleEntry[]>) {
      state.entries = action.payload;
    },
    setScheduleFilters(state, action: PayloadAction<ScheduleFilters>) {
      state.filters = action.payload;
    }
  }
});

export const { setScheduleEntries, setScheduleFilters } = schedulingSlice.actions;
export default schedulingSlice.reducer;
