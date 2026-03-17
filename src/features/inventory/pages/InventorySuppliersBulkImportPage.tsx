import { BulkImportWorkflowPage, type BulkImportFieldConfig } from "@app/components/forms/BulkImportWorkflowPage";
import { getImportCellValue, parseImportBoolean, toImportString } from "@app/components/forms/bulkImport.utils";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import type { Supplier, SupplierUpsertPayload } from "@features/inventory/types/inventory.types";

const fields: BulkImportFieldConfig<SupplierUpsertPayload>[] = [
  { name: "name", label: "Supplier Name", width: 220 },
  { name: "contactPerson", label: "Contact Person", width: 180 },
  { name: "email", label: "Email", width: 220 },
  { name: "phoneNumber", label: "Phone", width: 160 },
  { name: "addressLine1", label: "Address Line 1", width: 220 },
  { name: "addressLine2", label: "Address Line 2", width: 220 },
  { name: "city", label: "City", width: 140 },
  { name: "stateOrProvince", label: "State / Province", width: 160 },
  { name: "postalCode", label: "Postal Code", width: 130 },
  { name: "country", label: "Country", width: 140 },
  { name: "notes", label: "Notes", kind: "multiline", width: 260 },
  { name: "isActive", label: "Active", kind: "boolean", width: 110 },
];

function mapSpreadsheetRow({
  row,
  headerMap,
}: {
  row: unknown[];
  headerMap: Record<string, number>;
  sourceRowNumber: number;
}): SupplierUpsertPayload {
  return {
    name: toImportString(getImportCellValue(row, headerMap, ["name", "supplier", "supplierName"])),
    contactPerson:
      toImportString(getImportCellValue(row, headerMap, ["contactPerson", "contact", "contactName"])) || undefined,
    email: toImportString(getImportCellValue(row, headerMap, ["email"])) || undefined,
    phoneNumber: toImportString(getImportCellValue(row, headerMap, ["phoneNumber", "phone"])) || undefined,
    addressLine1: toImportString(getImportCellValue(row, headerMap, ["addressLine1", "address1", "street1"])) || undefined,
    addressLine2: toImportString(getImportCellValue(row, headerMap, ["addressLine2", "address2", "street2"])) || undefined,
    city: toImportString(getImportCellValue(row, headerMap, ["city"])) || undefined,
    stateOrProvince:
      toImportString(getImportCellValue(row, headerMap, ["stateOrProvince", "state", "province"])) || undefined,
    postalCode: toImportString(getImportCellValue(row, headerMap, ["postalCode", "zip", "zipCode"])) || undefined,
    country: toImportString(getImportCellValue(row, headerMap, ["country"])) || undefined,
    isActive: parseImportBoolean(getImportCellValue(row, headerMap, ["isActive", "active", "enabled"]), true),
    notes: toImportString(getImportCellValue(row, headerMap, ["notes", "description"])) || undefined,
  };
}

function validateValues(values: SupplierUpsertPayload) {
  const issues: string[] = [];
  if (!values.name) {
    issues.push("Missing supplier name");
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    issues.push("Email is not valid");
  }
  return issues;
}

export function InventorySuppliersBulkImportPage() {
  return (
    <BulkImportWorkflowPage<SupplierUpsertPayload, Supplier>
      title="Bulk Supplier Import"
      backTo="/inventory/suppliers"
      backLabel="Back to Suppliers"
      entityLabel="supplier"
      entityLabelPlural="suppliers"
      intro="Upload a CSV or Excel file, map it into supplier create fields, and preview exactly what will be imported."
      fields={fields}
      emptyState="Upload a CSV or XLSX file to preview mapped supplier rows."
      mapSpreadsheetRow={mapSpreadsheetRow}
      validateValues={validateValues}
      saveBulk={(body) => inventoryApi.createSuppliersBulk(body)}
    />
  );
}
