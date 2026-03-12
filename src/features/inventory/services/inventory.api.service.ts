import { apiClient } from "@shared/services/apiClient.service";
import type { ApiResponse } from "@shared/types/api.types";
import type {
  Product,
  ProductListItem,
  StockMovement,
  Category,
  Brand,
  UnitOfMeasure,
  Warehouse,
  Supplier,
  InventoryStock,
  ProductMetricsSummary
} from "@features/inventory/types/inventory.types";
import type { BrandMetricsSummary, WarehouseMetricsSummary, SupplierMetricsSummary } from "@features/inventory/types/inventory.types";

export const inventoryApi = {
  /* ── Products ─────────────────────────────────── */
  async listProducts(params?: { pageNumber?: number; pageSize?: number; searchTerm?: string; status?: number; categoryId?: string }): Promise<ApiResponse<ProductListItem[]>> {
    const { data } = await apiClient.get<ApiResponse<ProductListItem[]>>("/inventory/products", { params });
    return data;
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/inventory/products/${id}`);
    return data;
  },

  async getProductsSummary(params?: { searchTerm?: string; status?: number; categoryId?: string }): Promise<ApiResponse<ProductMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<ProductMetricsSummary>>("/inventory/products/summary", { params });
    return data;
  },

  async createProduct(body: import("@features/inventory/types/inventory.types").ProductUpsertPayload): Promise<ApiResponse<Product>> {
    const { data } = await apiClient.post<ApiResponse<Product>>("/inventory/products", body);
    return data;
  },

  async updateProduct(id: string, body: import("@features/inventory/types/inventory.types").ProductUpsertPayload): Promise<ApiResponse<Product>> {
    const { data } = await apiClient.put<ApiResponse<Product>>(`/inventory/products/${id}`, body);
    return data;
  },

  /* ── Stock ────────────────────────────────────── */
  async getProductStock(productId: string): Promise<ApiResponse<InventoryStock[]>> {
    const { data } = await apiClient.get<ApiResponse<InventoryStock[]>>(`/inventory/stocks/product/${productId}`);
    return data;
  },

  /* ── Movements ────────────────────────────────── */
  async getMovementsByProduct(productId: string): Promise<ApiResponse<StockMovement[]>> {
    const { data } = await apiClient.get<ApiResponse<StockMovement[]>>(`/inventory/stock-movements/product/${productId}`);
    return data;
  },

  async getMovementsByWarehouse(warehouseId: string): Promise<ApiResponse<StockMovement[]>> {
    const { data } = await apiClient.get<ApiResponse<StockMovement[]>>(`/inventory/stock-movements/warehouse/${warehouseId}`);
    return data;
  },

  /* ── Reference data ───────────────────────────── */
  async listCategories(): Promise<ApiResponse<Category[]>> {
    const { data } = await apiClient.get<ApiResponse<Category[]>>("/inventory/categories");
    return data;
  },

  async listBrands(): Promise<ApiResponse<Brand[]>> {
    const { data } = await apiClient.get<ApiResponse<Brand[]>>("/inventory/brands");
    return data;
  },

  async getBrandsSummary(): Promise<ApiResponse<BrandMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<BrandMetricsSummary>>("/inventory/brands/summary");
    return data;
  },

  async listUnits(): Promise<ApiResponse<UnitOfMeasure[]>> {
    const { data } = await apiClient.get<ApiResponse<UnitOfMeasure[]>>("/inventory/unit-of-measures");
    return data;
  },

  async listWarehouses(): Promise<ApiResponse<Warehouse[]>> {
    const { data } = await apiClient.get<ApiResponse<Warehouse[]>>("/inventory/warehouses");
    return data;
  },

  async getWarehousesSummary(): Promise<ApiResponse<WarehouseMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<WarehouseMetricsSummary>>("/inventory/warehouses/summary");
    return data;
  },

  async listSuppliers(): Promise<ApiResponse<Supplier[]>> {
    const { data } = await apiClient.get<ApiResponse<Supplier[]>>("/inventory/suppliers");
    return data;
  },

  async getSuppliersSummary(): Promise<ApiResponse<SupplierMetricsSummary>> {
    const { data } = await apiClient.get<ApiResponse<SupplierMetricsSummary>>("/inventory/suppliers/summary");
    return data;
  }
};
