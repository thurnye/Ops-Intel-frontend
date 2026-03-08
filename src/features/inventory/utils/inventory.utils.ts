import { ProductStatus, StockMovementType, type Product } from "@features/inventory/types/inventory.types";

/* ── Product status ───────────────────────────────── */

export function productStatusLabel(status: ProductStatus): string {
  const map: Record<ProductStatus, string> = {
    [ProductStatus.Draft]: "Draft",
    [ProductStatus.Active]: "Active",
    [ProductStatus.Inactive]: "Inactive",
    [ProductStatus.Discontinued]: "Discontinued"
  };
  return map[status] ?? "Unknown";
}

export function productStatusColor(status: ProductStatus): string {
  const map: Record<ProductStatus, string> = {
    [ProductStatus.Draft]: "#94a3b8",
    [ProductStatus.Active]: "#10b981",
    [ProductStatus.Inactive]: "#f59e0b",
    [ProductStatus.Discontinued]: "#ef4444"
  };
  return map[status] ?? "#94a3b8";
}

/* ── Stock movement type ──────────────────────────── */

export function movementTypeLabel(type: StockMovementType): string {
  const map: Record<StockMovementType, string> = {
    [StockMovementType.StockIn]: "Stock In",
    [StockMovementType.StockOut]: "Stock Out",
    [StockMovementType.AdjustmentIncrease]: "Adjustment (+)",
    [StockMovementType.AdjustmentDecrease]: "Adjustment (-)",
    [StockMovementType.TransferIn]: "Transfer In",
    [StockMovementType.TransferOut]: "Transfer Out",
    [StockMovementType.ReturnIn]: "Return In",
    [StockMovementType.ReturnOut]: "Return Out",
    [StockMovementType.Damaged]: "Damaged",
    [StockMovementType.Expired]: "Expired"
  };
  return map[type] ?? "Unknown";
}

export function movementTypeColor(type: StockMovementType): string {
  switch (type) {
    case StockMovementType.StockIn:
    case StockMovementType.AdjustmentIncrease:
    case StockMovementType.TransferIn:
    case StockMovementType.ReturnIn:
      return "#10b981";
    case StockMovementType.StockOut:
    case StockMovementType.AdjustmentDecrease:
    case StockMovementType.TransferOut:
    case StockMovementType.ReturnOut:
      return "#f59e0b";
    case StockMovementType.Damaged:
    case StockMovementType.Expired:
      return "#ef4444";
    default:
      return "#94a3b8";
  }
}

/* ── Stock helpers ────────────────────────────────── */

export function totalOnHand(product: Product): number {
  return product.inventoryStocks.reduce((s, st) => s + st.quantityOnHand, 0);
}

export function totalAvailable(product: Product): number {
  return product.inventoryStocks.reduce((s, st) => s + st.quantityAvailable, 0);
}

export function isLowStock(product: Product): boolean {
  return totalOnHand(product) <= product.reorderLevel && product.status === ProductStatus.Active;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
