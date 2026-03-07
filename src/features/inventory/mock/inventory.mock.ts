import type { InventoryItem } from "@features/inventory/types/inventory.types";

export const inventoryMock: InventoryItem[] = [
  {
    id: "inv-1",
    sku: "ALU-6061-BAR",
    description: "6061 aluminum extrusion bar",
    quantityOnHand: 420,
    reorderPoint: 200,
    location: "Plant A / Rack 3"
  },
  {
    id: "inv-2",
    sku: "ALU-7005-TUBE",
    description: "7005 extrusion tube",
    quantityOnHand: 88,
    reorderPoint: 120,
    location: "Plant B / Rack 1"
  }
];
