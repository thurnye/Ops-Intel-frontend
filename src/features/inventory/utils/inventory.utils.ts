import type { InventoryItem } from "@features/inventory/types/inventory.types";

export function isLowStock(item: InventoryItem): boolean {
  return item.quantityOnHand <= item.reorderPoint;
}
