import { BulkImportWorkflowPage, type BulkImportFieldConfig } from "@app/components/forms/BulkImportWorkflowPage";
import { getImportCellValue, parseImportBoolean, toImportString } from "@app/components/forms/bulkImport.utils";
import { shipmentsApi } from "@features/shipments/services/shipments.api.service";
import type { Carrier, CarrierUpsertPayload } from "@features/shipments/types/shipments.types";

const fields: BulkImportFieldConfig<CarrierUpsertPayload>[] = [
  { name: "carrierCode", label: "Carrier Code", width: 150 },
  { name: "name", label: "Carrier Name", width: 220 },
  { name: "contactName", label: "Contact Name", width: 180 },
  { name: "phone", label: "Phone", width: 160 },
  { name: "email", label: "Email", width: 220 },
  { name: "website", label: "Website", width: 220 },
  { name: "isActive", label: "Active", kind: "boolean", width: 110 },
];

function mapSpreadsheetRow({
  row,
  headerMap,
}: {
  row: unknown[];
  headerMap: Record<string, number>;
  sourceRowNumber: number;
}): CarrierUpsertPayload {
  return {
    carrierCode: toImportString(getImportCellValue(row, headerMap, ["carrierCode", "code"])),
    name: toImportString(getImportCellValue(row, headerMap, ["name", "carrier", "carrierName"])),
    contactName:
      toImportString(getImportCellValue(row, headerMap, ["contactName", "contact"])) || undefined,
    phone: toImportString(getImportCellValue(row, headerMap, ["phone", "phoneNumber"])) || undefined,
    email: toImportString(getImportCellValue(row, headerMap, ["email"])) || undefined,
    website: toImportString(getImportCellValue(row, headerMap, ["website", "url"])) || undefined,
    isActive: parseImportBoolean(getImportCellValue(row, headerMap, ["isActive", "active", "enabled"]), true),
  };
}

function validateValues(values: CarrierUpsertPayload) {
  const issues: string[] = [];
  if (!values.carrierCode) {
    issues.push("Missing carrier code");
  }
  if (!values.name) {
    issues.push("Missing carrier name");
  }
  return issues;
}

export function ShipmentsCarriersBulkImportPage() {
  return (
    <BulkImportWorkflowPage<CarrierUpsertPayload, Carrier>
      title="Bulk Carrier Import"
      backTo="/shipments/carriers"
      backLabel="Back to Carriers"
      entityLabel="carrier"
      entityLabelPlural="carriers"
      intro="Upload a CSV or Excel file, map it into carrier create fields, and preview exactly what will be imported."
      fields={fields}
      emptyState="Upload a CSV or XLSX file to preview mapped carrier rows."
      mapSpreadsheetRow={mapSpreadsheetRow}
      validateValues={validateValues}
      saveBulk={(body) => shipmentsApi.createCarriersBulk(body)}
    />
  );
}
