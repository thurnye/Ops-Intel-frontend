/* ── Enums ─────────────────────────────────────────── */

export enum ProductStatus {
  Draft = 1,
  Active = 2,
  Inactive = 3,
  Discontinued = 4
}

export enum StockMovementType {
  StockIn = 1,
  StockOut = 2,
  AdjustmentIncrease = 3,
  AdjustmentDecrease = 4,
  TransferIn = 5,
  TransferOut = 6,
  ReturnIn = 7,
  ReturnOut = 8,
  Damaged = 9,
  Expired = 10
}

/* ── Response types ───────────────────────────────── */

export type ProductImage = {
  id: string;
  productId: string;
  fileName: string;
  fileUrl: string;
  contentType?: string;
  fileSizeInBytes: number;
  isPrimary: boolean;
  displayOrder: number;
  altText?: string;
};

export type InventoryStock = {
  id: string;
  productId: string;
  warehouseId: string;
  warehouseName: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  quantityDamaged: number;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  categoryName: string;
  brandId?: string;
  brandName?: string;
  unitOfMeasureId: string;
  unitOfMeasureName: string;
  costPrice: number;
  sellingPrice: number;
  taxRate: number;
  reorderLevel: number;
  reorderQuantity: number;
  trackInventory: boolean;
  allowBackOrder: boolean;
  isSerialized: boolean;
  isBatchTracked: boolean;
  isPerishable: boolean;
  weight: number;
  length: number;
  width: number;
  height: number;
  status: ProductStatus;
  thumbnailImageUrl?: string;
  images: ProductImage[];
  inventoryStocks: InventoryStock[];
};

export type ProductListItem = {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  categoryId?: string;
  categoryName: string;
  brandName?: string;
  sellingPrice: number;
  status: ProductStatus;
  thumbnailImageUrl?: string;
};

export type StockMovement = {
  id: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  movementType: StockMovementType;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  referenceNumber?: string;
  reason?: string;
  notes?: string;
  movementDateUtc: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
};

export type Brand = {
  id: string;
  name: string;
  description?: string;
};

export type UnitOfMeasure = {
  id: string;
  name: string;
  symbol: string;
};

export type Warehouse = {
  id: string;
  name: string;
  code: string;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateOrProvince?: string;
  postalCode?: string;
  country?: string;
  isActive: boolean;
};

export type Supplier = {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateOrProvince?: string;
  postalCode?: string;
  country?: string;
  isActive: boolean;
  notes?: string;
};

export type ProductSupplier = {
  id: string;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  supplierProductCode?: string;
  supplierPrice: number;
  leadTimeInDays: number;
  isPreferredSupplier: boolean;
};

/* ── Filters ──────────────────────────────────────── */

export type ProductFilters = {
  query: string;
  status: ProductStatus | "all";
  categoryId: string | "all";
};

export type MovementFilters = {
  query: string;
  movementType: StockMovementType | "all";
  warehouseId: string | "all";
};
