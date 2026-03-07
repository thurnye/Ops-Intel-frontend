import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { inventoryMock } from "@features/inventory/mock/inventory.mock";
import type { InventoryItem } from "@features/inventory/types/inventory.types";

type InventoryState = {
  items: InventoryItem[];
  selectedItemId: string | null;
};

const initialState: InventoryState = {
  items: inventoryMock,
  selectedItemId: null
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<InventoryItem[]>) {
      state.items = action.payload;
    },
    setSelectedInventoryItem(state, action: PayloadAction<string | null>) {
      state.selectedItemId = action.payload;
    }
  }
});

export const { setItems, setSelectedInventoryItem } = inventorySlice.actions;
export default inventorySlice.reducer;
