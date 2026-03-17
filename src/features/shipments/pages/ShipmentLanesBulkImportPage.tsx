import { BulkImportWorkflowPage, type BulkImportFieldConfig } from "@app/components/forms/BulkImportWorkflowPage";
import { getImportCellValue, toImportString } from "@app/components/forms/bulkImport.utils";
import { shipmentsApi } from "@features/shipments/services/shipments.api.service";
import type { ShipmentAddress, ShipmentAddressUpsertPayload } from "@features/shipments/types/shipments.types";

const fields: BulkImportFieldConfig<ShipmentAddressUpsertPayload>[] = [
  { name: "addressType", label: "Address Type", width: 140 },
  { name: "contactName", label: "Contact Name", width: 180 },
  { name: "companyName", label: "Company", width: 220 },
  { name: "phone", label: "Phone", width: 160 },
  { name: "email", label: "Email", width: 220 },
  { name: "addressLine1", label: "Address Line 1", width: 220 },
  { name: "addressLine2", label: "Address Line 2", width: 220 },
  { name: "city", label: "City", width: 140 },
  { name: "stateOrProvince", label: "State / Province", width: 160 },
  { name: "postalCode", label: "Postal Code", width: 130 },
  { name: "country", label: "Country", width: 140 },
];

function mapSpreadsheetRow({
  row,
  headerMap,
}: {
  row: unknown[];
  headerMap: Record<string, number>;
  sourceRowNumber: number;
}): ShipmentAddressUpsertPayload {
  return {
    addressType: toImportString(getImportCellValue(row, headerMap, ["addressType", "type"])),
    contactName: toImportString(getImportCellValue(row, headerMap, ["contactName", "contact"])),
    companyName: toImportString(getImportCellValue(row, headerMap, ["companyName", "company"])) || undefined,
    phone: toImportString(getImportCellValue(row, headerMap, ["phone", "phoneNumber"])) || undefined,
    email: toImportString(getImportCellValue(row, headerMap, ["email"])) || undefined,
    addressLine1: toImportString(getImportCellValue(row, headerMap, ["addressLine1", "address1", "street1"])),
    addressLine2: toImportString(getImportCellValue(row, headerMap, ["addressLine2", "address2", "street2"])) || undefined,
    city: toImportString(getImportCellValue(row, headerMap, ["city"])),
    stateOrProvince: toImportString(
      getImportCellValue(row, headerMap, ["stateOrProvince", "state", "province"]),
    ),
    postalCode: toImportString(getImportCellValue(row, headerMap, ["postalCode", "zip", "zipCode"])),
    country: toImportString(getImportCellValue(row, headerMap, ["country"])),
  };
}

function validateValues(values: ShipmentAddressUpsertPayload) {
  const issues: string[] = [];
  if (!values.addressType) {
    issues.push("Missing address type");
  }
  if (!values.contactName) {
    issues.push("Missing contact name");
  }
  if (!values.addressLine1) {
    issues.push("Missing address line 1");
  }
  if (!values.city) {
    issues.push("Missing city");
  }
  if (!values.stateOrProvince) {
    issues.push("Missing state or province");
  }
  if (!values.postalCode) {
    issues.push("Missing postal code");
  }
  if (!values.country) {
    issues.push("Missing country");
  }
  return issues;
}

export function ShipmentLanesBulkImportPage() {
  return (
    <BulkImportWorkflowPage<ShipmentAddressUpsertPayload, ShipmentAddress>
      title="Bulk Lane Import"
      backTo="/shipments/lanes"
      backLabel="Back to Lanes"
      entityLabel="lane"
      entityLabelPlural="lanes"
      intro="Upload a CSV or Excel file, map it into shipment-address create fields, and preview exactly what will be imported."
      fields={fields}
      emptyState="Upload a CSV or XLSX file to preview mapped lane rows."
      mapSpreadsheetRow={mapSpreadsheetRow}
      validateValues={validateValues}
      saveBulk={(body) => shipmentsApi.createAddressesBulk(body)}
    />
  );
}
