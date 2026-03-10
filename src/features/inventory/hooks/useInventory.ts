import { useMemo } from "react";
import { useAppSelector } from "@app/hooks/app.hooks";
import { ProductStatus } from "@features/inventory/types/inventory.types";

export function useInventory() {
  const { products, productFilters, loading, page, pageSize, pagination, categories, warehouses } = useAppSelector((s) => s.inventory);

  const activeCount = products.filter((p) => p.status === ProductStatus.Active).length;

  return { products, allProducts: products, activeCount, loading, filters: productFilters, page, pageSize, pagination, categories, warehouses };
}

export function useProductById(id: string | undefined) {
  const { productDetails } = useAppSelector((s) => s.inventory);
  return id ? productDetails[id] : undefined;
}

export function useStockMovements() {
  const { movements, movementFilters, warehouses } = useAppSelector((s) => s.inventory);

  const filtered = useMemo(() => {
    let result = movements;
    const q = movementFilters.query.toLowerCase();
    if (q) {
      result = result.filter(
        (m) => m.productName.toLowerCase().includes(q) || (m.referenceNumber?.toLowerCase().includes(q))
      );
    }
    if (movementFilters.movementType !== "all") {
      result = result.filter((m) => m.movementType === movementFilters.movementType);
    }
    if (movementFilters.warehouseId !== "all") {
      result = result.filter((m) => m.warehouseId === movementFilters.warehouseId);
    }
    return result;
  }, [movements, movementFilters]);

  return { movements: filtered, warehouses, filters: movementFilters };
}
