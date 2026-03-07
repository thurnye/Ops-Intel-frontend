import { useAppSelector } from "@app/hooks/app.hooks";

export function useInventory() {
  return useAppSelector((state) => state.inventory.items);
}
