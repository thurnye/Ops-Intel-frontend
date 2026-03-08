import { apiClient } from "@shared/services/apiClient.service";
import type { PagedResponse } from "@shared/types/api.types";
import type {
  Product,
  ProductListItem,
  StockMovement,
  Category,
  Brand,
  UnitOfMeasure,
  Warehouse,
  Supplier,
  InventoryStock
} from "@features/inventory/types/inventory.types";

export const inventoryApi = {
  /* ── Products ─────────────────────────────────── */
  async listProducts(params?: { pageNumber?: number; pageSize?: number; search?: string; status?: number; categoryId?: string }): Promise<PagedResponse<ProductListItem>> {
    const { data } = await apiClient.get<PagedResponse<ProductListItem>>("/inventory/products", { params });
    return data;
  },

  async getProduct(id: string): Promise<Product> {
    const { data } = await apiClient.get<Product>(`/inventory/products/${id}`);
    return data;
  },

  /* ── Stock ────────────────────────────────────── */
  async getProductStock(productId: string): Promise<InventoryStock[]> {
    const { data } = await apiClient.get<InventoryStock[]>(`/inventory/products/${productId}/stock`);
    return data;
  },

  /* ── Movements ────────────────────────────────── */
  async listMovements(params?: { pageNumber?: number; pageSize?: number; productId?: string; warehouseId?: string; movementType?: number }): Promise<PagedResponse<StockMovement>> {
    const { data } = await apiClient.get<PagedResponse<StockMovement>>("/inventory/stock-movements", { params });
    return data;
  },

  /* ── Reference data ───────────────────────────── */
  async listCategories(): Promise<Category[]> {
    const { data } = await apiClient.get<Category[]>("/inventory/categories");
    return data;
  },

  async listBrands(): Promise<Brand[]> {
    const { data } = await apiClient.get<Brand[]>("/inventory/brands");
    return data;
  },

  async listUnits(): Promise<UnitOfMeasure[]> {
    const { data } = await apiClient.get<UnitOfMeasure[]>("/inventory/units-of-measure");
    return data;
  },

  async listWarehouses(): Promise<Warehouse[]> {
    const { data } = await apiClient.get<Warehouse[]>("/inventory/warehouses");
    return data;
  },

  async listSuppliers(): Promise<Supplier[]> {
    const { data } = await apiClient.get<Supplier[]>("/inventory/suppliers");
    return data;
  }
};
