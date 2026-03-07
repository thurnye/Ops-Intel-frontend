export type InventoryItem = {
  id: string;
  sku: string;
  description: string;
  quantityOnHand: number;
  reorderPoint: number;
  location: string;
};
