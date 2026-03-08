import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { productsMock, movementsMock, categoriesMock, warehousesMock } from "@features/inventory/mock/inventory.mock";
import type { Product, StockMovement, Category, Warehouse, ProductFilters, MovementFilters } from "@features/inventory/types/inventory.types";

type InventoryState = {
  products: Product[];
  movements: StockMovement[];
  categories: Category[];
  warehouses: Warehouse[];
  selectedProductId: string | null;
  productFilters: ProductFilters;
  movementFilters: MovementFilters;
  loading: boolean;
};

const initialState: InventoryState = {
  products: productsMock,
  movements: movementsMock,
  categories: categoriesMock,
  warehouses: warehousesMock,
  selectedProductId: null,
  productFilters: { query: "", status: "all", categoryId: "all" },
  movementFilters: { query: "", movementType: "all", warehouseId: "all" },
  loading: false
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    setMovements(state, action: PayloadAction<StockMovement[]>) {
      state.movements = action.payload;
    },
    setSelectedProduct(state, action: PayloadAction<string | null>) {
      state.selectedProductId = action.payload;
    },
    setProductFilters(state, action: PayloadAction<Partial<ProductFilters>>) {
      state.productFilters = { ...state.productFilters, ...action.payload };
    },
    setMovementFilters(state, action: PayloadAction<Partial<MovementFilters>>) {
      state.movementFilters = { ...state.movementFilters, ...action.payload };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
  }
});

export const { setProducts, setMovements, setSelectedProduct, setProductFilters, setMovementFilters, setLoading } = inventorySlice.actions;
export default inventorySlice.reducer;
