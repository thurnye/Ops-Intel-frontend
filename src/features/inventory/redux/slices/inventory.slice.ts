import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product, ProductListItem, StockMovement, Category, Warehouse, ProductFilters, MovementFilters } from "@features/inventory/types/inventory.types";
import type { PaginationMeta } from "@shared/types/api.types";
import { fetchInventoryMovementsData, fetchInventoryOverviewData, fetchInventoryProductById, fetchInventoryReferenceData } from "@features/inventory/redux/inventory.thunks";

type InventoryState = {
  products: ProductListItem[];
  productDetails: Record<string, Product>;
  movements: StockMovement[];
  categories: Category[];
  warehouses: Warehouse[];
  selectedProductId: string | null;
  productFilters: ProductFilters;
  movementFilters: MovementFilters;
  page: number;
  pageSize: number;
  pagination: PaginationMeta | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
};

const initialState: InventoryState = {
  products: [],
  productDetails: {},
  movements: [],
  categories: [],
  warehouses: [],
  selectedProductId: null,
  productFilters: { query: "", status: "all", categoryId: "all" },
  movementFilters: { query: "", movementType: "all", warehouseId: "all" },
  page: 1,
  pageSize: 10,
  pagination: null,
  loading: false,
  detailLoading: false,
  error: null
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setSelectedProduct(state, action: PayloadAction<string | null>) {
      state.selectedProductId = action.payload;
    },
    setProductFilters(state, action: PayloadAction<Partial<ProductFilters>>) {
      state.productFilters = { ...state.productFilters, ...action.payload };
    },
    setMovementFilters(state, action: PayloadAction<Partial<MovementFilters>>) {
      state.movementFilters = { ...state.movementFilters, ...action.payload };
    },
    setInventoryPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setInventoryPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryOverviewData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryOverviewData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInventoryOverviewData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load inventory data.";
      })
      .addCase(fetchInventoryReferenceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryReferenceData.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.warehouses = action.payload.warehouses;
      })
      .addCase(fetchInventoryReferenceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load inventory reference data.";
      })
      .addCase(fetchInventoryMovementsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryMovementsData.fulfilled, (state, action) => {
        state.loading = false;
        state.movements = action.payload.movements;
        state.warehouses = action.payload.warehouses;
      })
      .addCase(fetchInventoryMovementsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load inventory movements.";
      })
      .addCase(fetchInventoryProductById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchInventoryProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.productDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchInventoryProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload ?? "Failed to load inventory product.";
      });
  }
});

export const { setSelectedProduct, setProductFilters, setMovementFilters, setInventoryPage, setInventoryPageSize } = inventorySlice.actions;
export default inventorySlice.reducer;
