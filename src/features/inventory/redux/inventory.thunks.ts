import { createAsyncThunk } from "@reduxjs/toolkit";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import type { Category, Product, ProductFilters, ProductListItem, StockMovement, Warehouse } from "@features/inventory/types/inventory.types";
import type { PaginationMeta } from "@shared/types/api.types";
import { getApiData, getErrorMessage, getPagedItems, getPaginationMeta } from "@shared/utils/asyncThunk.utils";

type InventoryOverviewPayload = {
  products: ProductListItem[];
  pagination: PaginationMeta | null;
};

type InventoryReferenceDataPayload = {
  categories: Category[];
  warehouses: Warehouse[];
};

type InventoryMovementsPayload = {
  movements: StockMovement[];
  warehouses: Warehouse[];
};

export const fetchInventoryOverviewData = createAsyncThunk<InventoryOverviewPayload, { page: number; pageSize: number; filters: ProductFilters }, { rejectValue: string }>(
  "inventory/fetchOverviewData",
  async ({ page, pageSize, filters }, { rejectWithValue }) => {
    try {
      const productsResponse = await inventoryApi.listProducts({
        pageNumber: page,
        pageSize,
        searchTerm: filters.query || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        categoryId: filters.categoryId === "all" ? undefined : filters.categoryId
      });

      return {
        products: getPagedItems(productsResponse),
        pagination: getPaginationMeta(productsResponse)
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load inventory data."));
    }
  }
);

export const fetchInventoryReferenceData = createAsyncThunk<InventoryReferenceDataPayload, void, { rejectValue: string }>(
  "inventory/fetchReferenceData",
  async (_, { rejectWithValue }) => {
    try {
      const [categoriesResponse, warehousesResponse] = await Promise.all([
        inventoryApi.listCategories(),
        inventoryApi.listWarehouses()
      ]);

      return {
        categories: getApiData(categoriesResponse, []),
        warehouses: getApiData(warehousesResponse, [])
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load inventory reference data."));
    }
  }
);

export const fetchInventoryProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  "inventory/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      return getApiData(await inventoryApi.getProduct(productId), null as never);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load inventory product."));
    }
  }
);

export const fetchInventoryMovementsData = createAsyncThunk<InventoryMovementsPayload, void, { rejectValue: string }>(
  "inventory/fetchMovementsData",
  async (_, { rejectWithValue }) => {
    try {
      const warehouses = getApiData(await inventoryApi.listWarehouses(), []);
      const movementGroups = await Promise.all(warehouses.map(async (warehouse) => getApiData(await inventoryApi.getMovementsByWarehouse(warehouse.id), [])));
      const movementsById = new Map<string, StockMovement>();

      movementGroups.flat().forEach((movement) => {
        movementsById.set(movement.id, movement);
      });

      return {
        warehouses,
        movements: Array.from(movementsById.values()).sort((left, right) => right.movementDateUtc.localeCompare(left.movementDateUtc))
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load inventory movements."));
    }
  }
);
