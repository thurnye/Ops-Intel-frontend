import {
  ProductStatus,
  StockMovementType,
  type Brand,
  type Category,
  type Product,
  type ProductListItem,
  type ProductSupplier,
  type StockMovement,
  type Supplier,
  type UnitOfMeasure,
  type Warehouse
} from "@features/inventory/types/inventory.types";

/* ── Categories ───────────────────────────────────── */

export const categoriesMock: Category[] = [
  { id: "cat-1", name: "Raw Materials", description: "Unprocessed materials" },
  { id: "cat-2", name: "Components", description: "Manufactured components" },
  { id: "cat-3", name: "Finished Goods", description: "Ready for sale" },
  { id: "cat-4", name: "Packaging", description: "Packaging supplies" }
];

/* ── Brands ────────────────────────────────────────── */

export const brandsMock: Brand[] = [
  { id: "brand-1", name: "Alcoa", description: "Aluminum supplier" },
  { id: "brand-2", name: "Parker Hannifin", description: "Industrial components" },
  { id: "brand-3", name: "3M", description: "Manufacturing supplies" }
];

/* ── Units of Measure ─────────────────────────────── */

export const unitsMock: UnitOfMeasure[] = [
  { id: "uom-1", name: "Piece", symbol: "pcs" },
  { id: "uom-2", name: "Kilogram", symbol: "kg" },
  { id: "uom-3", name: "Meter", symbol: "m" },
  { id: "uom-4", name: "Box", symbol: "box" }
];

/* ── Warehouses ───────────────────────────────────── */

export const warehousesMock: Warehouse[] = [
  { id: "wh-1", name: "Plant A Warehouse", code: "WH-A", description: "Main production warehouse", addressLine1: "100 Industrial Blvd", city: "Springfield", stateOrProvince: "IL", postalCode: "62701", country: "US", isActive: true },
  { id: "wh-2", name: "Plant B Warehouse", code: "WH-B", description: "Secondary storage", addressLine1: "250 Commerce Dr", city: "Springfield", stateOrProvince: "IL", postalCode: "62702", country: "US", isActive: true },
  { id: "wh-3", name: "Distribution Center", code: "DC-1", description: "Shipping hub", addressLine1: "500 Logistics Way", city: "Chicago", stateOrProvince: "IL", postalCode: "60601", country: "US", isActive: true }
];

/* ── Suppliers ─────────────────────────────────────── */

export const suppliersMock: Supplier[] = [
  { id: "sup-1", name: "Alcoa Corp", contactPerson: "James Miller", email: "james@alcoa.example", phoneNumber: "+1-555-0101", addressLine1: "201 Isabella St", city: "Pittsburgh", stateOrProvince: "PA", postalCode: "15212", country: "US", isActive: true },
  { id: "sup-2", name: "Parker Industrial", contactPerson: "Sarah Chen", email: "sarah@parker.example", phoneNumber: "+1-555-0202", addressLine1: "6035 Parkland Blvd", city: "Cleveland", stateOrProvince: "OH", postalCode: "44124", country: "US", isActive: true },
  { id: "sup-3", name: "3M Supply Co", contactPerson: "David Park", email: "david@3m-supply.example", phoneNumber: "+1-555-0303", addressLine1: "3M Center", city: "St. Paul", stateOrProvince: "MN", postalCode: "55144", country: "US", isActive: true }
];

/* ── Products (full detail) ───────────────────────── */

export const productsMock: Product[] = [
  {
    id: "prod-1",
    name: "6061 Aluminum Extrusion Bar",
    description: "High-strength aluminum alloy extrusion bar, 6061-T6 grade",
    sku: "ALU-6061-BAR",
    barcode: "8901234560011",
    categoryId: "cat-1",
    categoryName: "Raw Materials",
    brandId: "brand-1",
    brandName: "Alcoa",
    unitOfMeasureId: "uom-2",
    unitOfMeasureName: "Kilogram",
    costPrice: 4.25,
    sellingPrice: 6.80,
    taxRate: 0,
    reorderLevel: 200,
    reorderQuantity: 500,
    trackInventory: true,
    allowBackOrder: false,
    isSerialized: false,
    isBatchTracked: true,
    isPerishable: false,
    weight: 1,
    length: 3000,
    width: 50,
    height: 50,
    status: ProductStatus.Active,
    thumbnailImageUrl: undefined,
    images: [],
    inventoryStocks: [
      { id: "stk-1a", productId: "prod-1", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", quantityOnHand: 420, quantityReserved: 80, quantityAvailable: 340, quantityDamaged: 0 },
      { id: "stk-1b", productId: "prod-1", warehouseId: "wh-2", warehouseName: "Plant B Warehouse", quantityOnHand: 150, quantityReserved: 0, quantityAvailable: 150, quantityDamaged: 5 }
    ]
  },
  {
    id: "prod-2",
    name: "7005 Aluminum Extrusion Tube",
    description: "Lightweight aluminum tube for structural applications",
    sku: "ALU-7005-TUBE",
    barcode: "8901234560028",
    categoryId: "cat-1",
    categoryName: "Raw Materials",
    brandId: "brand-1",
    brandName: "Alcoa",
    unitOfMeasureId: "uom-3",
    unitOfMeasureName: "Meter",
    costPrice: 8.50,
    sellingPrice: 13.20,
    taxRate: 0,
    reorderLevel: 120,
    reorderQuantity: 300,
    trackInventory: true,
    allowBackOrder: true,
    isSerialized: false,
    isBatchTracked: true,
    isPerishable: false,
    weight: 0.8,
    length: 6000,
    width: 40,
    height: 40,
    status: ProductStatus.Active,
    thumbnailImageUrl: undefined,
    images: [],
    inventoryStocks: [
      { id: "stk-2a", productId: "prod-2", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", quantityOnHand: 88, quantityReserved: 30, quantityAvailable: 58, quantityDamaged: 2 }
    ]
  },
  {
    id: "prod-3",
    name: "Hydraulic Cylinder Seal Kit",
    description: "Complete seal replacement kit for Parker H-series cylinders",
    sku: "HYD-SEAL-KIT",
    barcode: "8901234560035",
    categoryId: "cat-2",
    categoryName: "Components",
    brandId: "brand-2",
    brandName: "Parker Hannifin",
    unitOfMeasureId: "uom-1",
    unitOfMeasureName: "Piece",
    costPrice: 34.00,
    sellingPrice: 52.50,
    taxRate: 8.25,
    reorderLevel: 50,
    reorderQuantity: 100,
    trackInventory: true,
    allowBackOrder: false,
    isSerialized: true,
    isBatchTracked: false,
    isPerishable: false,
    weight: 0.45,
    length: 150,
    width: 150,
    height: 40,
    status: ProductStatus.Active,
    thumbnailImageUrl: undefined,
    images: [],
    inventoryStocks: [
      { id: "stk-3a", productId: "prod-3", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", quantityOnHand: 210, quantityReserved: 15, quantityAvailable: 195, quantityDamaged: 0 },
      { id: "stk-3b", productId: "prod-3", warehouseId: "wh-3", warehouseName: "Distribution Center", quantityOnHand: 65, quantityReserved: 10, quantityAvailable: 55, quantityDamaged: 0 }
    ]
  },
  {
    id: "prod-4",
    name: "Industrial Adhesive Tape Roll",
    description: "3M VHB heavy-duty double-sided tape, 25mm x 33m",
    sku: "ADH-VHB-25",
    barcode: "8901234560042",
    categoryId: "cat-3",
    categoryName: "Finished Goods",
    brandId: "brand-3",
    brandName: "3M",
    unitOfMeasureId: "uom-4",
    unitOfMeasureName: "Box",
    costPrice: 18.75,
    sellingPrice: 29.99,
    taxRate: 8.25,
    reorderLevel: 30,
    reorderQuantity: 60,
    trackInventory: true,
    allowBackOrder: false,
    isSerialized: false,
    isBatchTracked: true,
    isPerishable: false,
    weight: 0.35,
    length: 200,
    width: 30,
    height: 30,
    status: ProductStatus.Active,
    thumbnailImageUrl: undefined,
    images: [],
    inventoryStocks: [
      { id: "stk-4a", productId: "prod-4", warehouseId: "wh-3", warehouseName: "Distribution Center", quantityOnHand: 144, quantityReserved: 24, quantityAvailable: 120, quantityDamaged: 0 }
    ]
  },
  {
    id: "prod-5",
    name: "Corrugated Shipping Box (Large)",
    description: "Double-wall corrugated box, 600x400x400mm",
    sku: "PKG-BOX-LG",
    barcode: "8901234560059",
    categoryId: "cat-4",
    categoryName: "Packaging",
    brandId: undefined,
    brandName: undefined,
    unitOfMeasureId: "uom-1",
    unitOfMeasureName: "Piece",
    costPrice: 2.10,
    sellingPrice: 3.50,
    taxRate: 0,
    reorderLevel: 500,
    reorderQuantity: 1000,
    trackInventory: true,
    allowBackOrder: true,
    isSerialized: false,
    isBatchTracked: false,
    isPerishable: false,
    weight: 0.6,
    length: 600,
    width: 400,
    height: 400,
    status: ProductStatus.Active,
    thumbnailImageUrl: undefined,
    images: [],
    inventoryStocks: [
      { id: "stk-5a", productId: "prod-5", warehouseId: "wh-3", warehouseName: "Distribution Center", quantityOnHand: 820, quantityReserved: 200, quantityAvailable: 620, quantityDamaged: 12 }
    ]
  },
  {
    id: "prod-6",
    name: "Stainless Steel Flange Bearing",
    description: "Pillow block flange bearing, 25mm bore — discontinued model",
    sku: "BRG-FLG-25",
    barcode: "8901234560066",
    categoryId: "cat-2",
    categoryName: "Components",
    brandId: "brand-2",
    brandName: "Parker Hannifin",
    unitOfMeasureId: "uom-1",
    unitOfMeasureName: "Piece",
    costPrice: 22.00,
    sellingPrice: 38.00,
    taxRate: 8.25,
    reorderLevel: 0,
    reorderQuantity: 0,
    trackInventory: true,
    allowBackOrder: false,
    isSerialized: false,
    isBatchTracked: false,
    isPerishable: false,
    weight: 0.95,
    length: 100,
    width: 80,
    height: 60,
    status: ProductStatus.Discontinued,
    thumbnailImageUrl: undefined,
    images: [],
    inventoryStocks: [
      { id: "stk-6a", productId: "prod-6", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", quantityOnHand: 14, quantityReserved: 0, quantityAvailable: 14, quantityDamaged: 3 }
    ]
  }
];

/* ── Product list items (slim) ────────────────────── */

export const productListMock: ProductListItem[] = productsMock.map((p) => ({
  id: p.id,
  name: p.name,
  sku: p.sku,
  barcode: p.barcode,
  categoryName: p.categoryName,
  brandName: p.brandName,
  sellingPrice: p.sellingPrice,
  status: p.status,
  thumbnailImageUrl: p.thumbnailImageUrl
}));

/* ── Product-Supplier links ───────────────────────── */

export const productSuppliersMock: ProductSupplier[] = [
  { id: "ps-1", productId: "prod-1", productName: "6061 Aluminum Extrusion Bar", supplierId: "sup-1", supplierName: "Alcoa Corp", supplierProductCode: "ALC-6061-B", supplierPrice: 4.10, leadTimeInDays: 14, isPreferredSupplier: true },
  { id: "ps-2", productId: "prod-2", productName: "7005 Aluminum Extrusion Tube", supplierId: "sup-1", supplierName: "Alcoa Corp", supplierProductCode: "ALC-7005-T", supplierPrice: 8.30, leadTimeInDays: 14, isPreferredSupplier: true },
  { id: "ps-3", productId: "prod-3", productName: "Hydraulic Cylinder Seal Kit", supplierId: "sup-2", supplierName: "Parker Industrial", supplierProductCode: "PKR-SEAL-H", supplierPrice: 32.00, leadTimeInDays: 7, isPreferredSupplier: true },
  { id: "ps-4", productId: "prod-4", productName: "Industrial Adhesive Tape Roll", supplierId: "sup-3", supplierName: "3M Supply Co", supplierProductCode: "3M-VHB-25", supplierPrice: 17.50, leadTimeInDays: 5, isPreferredSupplier: true }
];

/* ── Stock movements ──────────────────────────────── */

export const movementsMock: StockMovement[] = [
  { id: "mov-1", productId: "prod-1", productName: "6061 Aluminum Extrusion Bar", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", movementType: StockMovementType.StockIn, quantity: 120, quantityBefore: 300, quantityAfter: 420, referenceNumber: "PO-2024-0041", reason: "Purchase order received", movementDateUtc: "2026-03-07T09:15:00Z" },
  { id: "mov-2", productId: "prod-2", productName: "7005 Aluminum Extrusion Tube", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", movementType: StockMovementType.StockOut, quantity: 80, quantityBefore: 168, quantityAfter: 88, referenceNumber: "SO-1025", reason: "Sales order fulfillment", movementDateUtc: "2026-03-07T10:30:00Z" },
  { id: "mov-3", productId: "prod-3", productName: "Hydraulic Cylinder Seal Kit", warehouseId: "wh-3", warehouseName: "Distribution Center", movementType: StockMovementType.TransferIn, quantity: 40, quantityBefore: 25, quantityAfter: 65, referenceNumber: "TRF-0088", reason: "Inter-warehouse transfer from Plant A", movementDateUtc: "2026-03-06T14:00:00Z" },
  { id: "mov-4", productId: "prod-5", productName: "Corrugated Shipping Box (Large)", warehouseId: "wh-3", warehouseName: "Distribution Center", movementType: StockMovementType.StockIn, quantity: 500, quantityBefore: 320, quantityAfter: 820, referenceNumber: "PO-2024-0039", reason: "Bulk restock from supplier", movementDateUtc: "2026-03-06T08:45:00Z" },
  { id: "mov-5", productId: "prod-6", productName: "Stainless Steel Flange Bearing", warehouseId: "wh-1", warehouseName: "Plant A Warehouse", movementType: StockMovementType.Damaged, quantity: 3, quantityBefore: 17, quantityAfter: 14, reason: "Damaged during inspection", notes: "Rust detected on bearing surface", movementDateUtc: "2026-03-05T16:20:00Z" },
  { id: "mov-6", productId: "prod-4", productName: "Industrial Adhesive Tape Roll", warehouseId: "wh-3", warehouseName: "Distribution Center", movementType: StockMovementType.StockOut, quantity: 24, quantityBefore: 168, quantityAfter: 144, referenceNumber: "SO-1028", reason: "Sales order fulfillment", movementDateUtc: "2026-03-05T11:10:00Z" },
  { id: "mov-7", productId: "prod-1", productName: "6061 Aluminum Extrusion Bar", warehouseId: "wh-2", warehouseName: "Plant B Warehouse", movementType: StockMovementType.AdjustmentIncrease, quantity: 10, quantityBefore: 140, quantityAfter: 150, reason: "Inventory count adjustment", notes: "Physical count higher than system", movementDateUtc: "2026-03-04T15:00:00Z" }
];

/* ── Aggregate helper for summary cards ───────────── */

export function computeStockSummary(products: Product[]) {
  const allStocks = products.flatMap((p) => p.inventoryStocks);
  const totalOnHand = allStocks.reduce((s, st) => s + st.quantityOnHand, 0);
  const totalReserved = allStocks.reduce((s, st) => s + st.quantityReserved, 0);
  const totalAvailable = allStocks.reduce((s, st) => s + st.quantityAvailable, 0);
  const totalDamaged = allStocks.reduce((s, st) => s + st.quantityDamaged, 0);

  const lowStockCount = products.filter((p) => {
    const totalQty = p.inventoryStocks.reduce((s, st) => s + st.quantityOnHand, 0);
    return totalQty <= p.reorderLevel && p.status === ProductStatus.Active;
  }).length;

  return { totalOnHand, totalReserved, totalAvailable, totalDamaged, lowStockCount };
}
