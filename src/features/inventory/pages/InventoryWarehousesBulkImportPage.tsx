import { BulkImportWorkflowPage, type BulkImportFieldConfig } from "@app/components/forms/BulkImportWorkflowPage";
import { getImportCellValue, parseImportBoolean, toImportString } from "@app/components/forms/bulkImport.utils";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import type { Warehouse, WarehouseUpsertPayload } from "@features/inventory/types/inventory.types";

const fields: BulkImportFieldConfig<WarehouseUpsertPayload>[] = [
  { name: "name", label: "Warehouse Name", width: 220 },
  { name: "code", label: "Code", width: 120 },
  { name: "description", label: "Description", kind: "multiline", width: 260 },
  { name: "addressLine1", label: "Address Line 1", width: 220 },
  { name: "addressLine2", label: "Address Line 2", width: 220 },
  { name: "city", label: "City", width: 140 },
  { name: "stateOrProvince", label: "State / Province", width: 160 },
  { name: "postalCode", label: "Postal Code", width: 130 },
  { name: "country", label: "Country", width: 140 },
  { name: "isActive", label: "Active", kind: "boolean", width: 110 },
];

function mapSpreadsheetRow({
  row,
  headerMap,
}: {
  row: unknown[];
  headerMap: Record<string, number>;
  sourceRowNumber: number;
}): WarehouseUpsertPayload {
  return {
    name: toImportString(getImportCellValue(row, headerMap, ["name", "warehouse", "warehouseName"])),
    code: toImportString(getImportCellValue(row, headerMap, ["code", "warehouseCode"])),
    description: toImportString(getImportCellValue(row, headerMap, ["description", "notes"])) || undefined,
    addressLine1: toImportString(getImportCellValue(row, headerMap, ["addressLine1", "address1", "street1"])) || undefined,
    addressLine2: toImportString(getImportCellValue(row, headerMap, ["addressLine2", "address2", "street2"])) || undefined,
    city: toImportString(getImportCellValue(row, headerMap, ["city"])) || undefined,
    stateOrProvince:
      toImportString(getImportCellValue(row, headerMap, ["stateOrProvince", "state", "province"])) || undefined,
    postalCode: toImportString(getImportCellValue(row, headerMap, ["postalCode", "zip", "zipCode"])) || undefined,
    country: toImportString(getImportCellValue(row, headerMap, ["country"])) || undefined,
    isActive: parseImportBoolean(getImportCellValue(row, headerMap, ["isActive", "active", "enabled"]), true),
  };
}

function validateValues(values: WarehouseUpsertPayload) {
  const issues: string[] = [];
  if (!values.name) {
    issues.push("Missing warehouse name");
  }
  if (!values.code) {
    issues.push("Missing warehouse code");
  }
  return issues;
}

export function InventoryWarehousesBulkImportPage() {
  return (
    <BulkImportWorkflowPage<WarehouseUpsertPayload, Warehouse>
      title="Bulk Warehouse Import"
      backTo="/inventory/warehouses"
      backLabel="Back to Warehouses"
      entityLabel="warehouse"
      entityLabelPlural="warehouses"
      intro="Upload a CSV or Excel file, map it into warehouse create fields, and preview exactly what will be imported."
      fields={fields}
      emptyState="Upload a CSV or XLSX file to preview mapped warehouse rows."
      mapSpreadsheetRow={mapSpreadsheetRow}
      validateValues={validateValues}
      saveBulk={(body) => inventoryApi.createWarehousesBulk(body)}
    />
  );
}
