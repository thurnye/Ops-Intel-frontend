import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppUser, UsersFilters } from "@features/users/types/users.types";
import { usersMock } from "@features/users/mock/users.mock";

type UsersState = { users: AppUser[]; selectedUserId: string | null; filters: UsersFilters; loading: boolean };

const initialState: UsersState = {
  users: usersMock, selectedUserId: null,
  filters: { query: "", role: "", status: "" }, loading: false
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<AppUser[]>) { state.users = action.payload; },
    setSelectedUser(state, action: PayloadAction<string | null>) { state.selectedUserId = action.payload; },
    setUsersFilters(state, action: PayloadAction<UsersFilters>) { state.filters = action.payload; }
  }
});

export const { setUsers, setSelectedUser, setUsersFilters } = usersSlice.actions;
export default usersSlice.reducer;
