import { BulkImportWorkflowPage, type BulkImportFieldConfig } from "@app/components/forms/BulkImportWorkflowPage";
import {
  getImportCellValue,
  parseImportBoolean,
  parseImportEnum,
  toImportString,
} from "@app/components/forms/bulkImport.utils";
import { shipmentsApi } from "@features/shipments/services/shipments.api.service";
import {
  ShipmentPriority,
  ShipmentType,
  type Shipment,
  type ShipmentUpsertPayload,
} from "@features/shipments/types/shipments.types";

const fields: BulkImportFieldConfig<ShipmentUpsertPayload>[] = [
  { name: "orderId", label: "Order ID", width: 180 },
  { name: "warehouseId", label: "Warehouse ID", width: 180 },
  { name: "originAddressId", label: "Origin Address ID", width: 200 },
  { name: "destinationAddressId", label: "Destination Address ID", width: 220 },
  { name: "carrierId", label: "Carrier ID", width: 180 },
  { name: "carrierServiceId", label: "Carrier Service ID", width: 200 },
  {
    name: "type",
    label: "Type",
    kind: "select",
    width: 130,
    options: [
      { label: "Outbound", value: ShipmentType.Outbound },
      { label: "Transfer", value: ShipmentType.Transfer },
      { label: "Return", value: ShipmentType.Return },
      { label: "Drop Ship", value: ShipmentType.DropShip },
    ],
  },
  {
    name: "priority",
    label: "Priority",
    kind: "select",
    width: 130,
    options: [
      { label: "Low", value: ShipmentPriority.Low },
      { label: "Normal", value: ShipmentPriority.Normal },
      { label: "High", value: ShipmentPriority.High },
      { label: "Urgent", value: ShipmentPriority.Urgent },
    ],
  },
  { name: "customerReference", label: "Customer Reference", width: 180 },
  { name: "externalReference", label: "External Reference", width: 180 },
  { name: "trackingNumber", label: "Tracking Number", width: 180 },
  { name: "masterTrackingNumber", label: "Master Tracking", width: 180 },
  { name: "plannedShipDateUtc", label: "Planned Ship Date", kind: "date", width: 180 },
  { name: "plannedDeliveryDateUtc", label: "Planned Delivery", kind: "date", width: 180 },
  { name: "scheduledPickupStartUtc", label: "Pickup Start", kind: "date", width: 180 },
  { name: "scheduledPickupEndUtc", label: "Pickup End", kind: "date", width: 180 },
  { name: "isPartialShipment", label: "Partial", kind: "boolean", width: 110 },
  { name: "requiresSignature", label: "Signature", kind: "boolean", width: 110 },
  { name: "isFragile", label: "Fragile", kind: "boolean", width: 110 },
  { name: "isHazardous", label: "Hazardous", kind: "boolean", width: 120 },
  { name: "isTemperatureControlled", label: "Temp Controlled", kind: "boolean", width: 140 },
  { name: "isInsured", label: "Insured", kind: "boolean", width: 110 },
  { name: "isCrossBorder", label: "Cross Border", kind: "boolean", width: 130 },
  { name: "currencyCode", label: "Currency", width: 110 },
  { name: "shippingTerms", label: "Shipping Terms", width: 160 },
  { name: "incoterm", label: "Incoterm", width: 120 },
  { name: "notes", label: "Notes", kind: "multiline", width: 260 },
  { name: "internalNotes", label: "Internal Notes", kind: "multiline", width: 260 },
];

function mapSpreadsheetRow({
  row,
  headerMap,
}: {
  row: unknown[];
  headerMap: Record<string, number>;
  sourceRowNumber: number;
}): ShipmentUpsertPayload {
  return {
    orderId: toImportString(getImportCellValue(row, headerMap, ["orderId", "order"])) || undefined,
    warehouseId: toImportString(getImportCellValue(row, headerMap, ["warehouseId", "warehouse"])) || undefined,
    originAddressId: toImportString(getImportCellValue(row, headerMap, ["originAddressId", "origin", "fromAddressId"])),
    destinationAddressId: toImportString(
      getImportCellValue(row, headerMap, ["destinationAddressId", "destination", "toAddressId"]),
    ),
    carrierId: toImportString(getImportCellValue(row, headerMap, ["carrierId", "carrier"])) || undefined,
    carrierServiceId:
      toImportString(getImportCellValue(row, headerMap, ["carrierServiceId", "serviceId"])) || undefined,
    type: parseImportEnum(getImportCellValue(row, headerMap, ["type", "shipmentType"]), ShipmentType, ShipmentType.Outbound),
    priority: parseImportEnum(
      getImportCellValue(row, headerMap, ["priority", "shipmentPriority"]),
      ShipmentPriority,
      ShipmentPriority.Normal,
    ),
    customerReference:
      toImportString(getImportCellValue(row, headerMap, ["customerReference", "customerRef"])) || undefined,
    externalReference:
      toImportString(getImportCellValue(row, headerMap, ["externalReference", "externalRef"])) || undefined,
    trackingNumber:
      toImportString(getImportCellValue(row, headerMap, ["trackingNumber", "tracking"])) || undefined,
    masterTrackingNumber:
      toImportString(getImportCellValue(row, headerMap, ["masterTrackingNumber", "masterTracking"])) || undefined,
    plannedShipDateUtc:
      toImportString(getImportCellValue(row, headerMap, ["plannedShipDateUtc", "plannedShipDate"])) || undefined,
    plannedDeliveryDateUtc:
      toImportString(getImportCellValue(row, headerMap, ["plannedDeliveryDateUtc", "plannedDeliveryDate"])) || undefined,
    scheduledPickupStartUtc:
      toImportString(getImportCellValue(row, headerMap, ["scheduledPickupStartUtc", "pickupStart"])) || undefined,
    scheduledPickupEndUtc:
      toImportString(getImportCellValue(row, headerMap, ["scheduledPickupEndUtc", "pickupEnd"])) || undefined,
    isPartialShipment: parseImportBoolean(getImportCellValue(row, headerMap, ["isPartialShipment", "partial"]), false),
    requiresSignature: parseImportBoolean(
      getImportCellValue(row, headerMap, ["requiresSignature", "signature"]),
      false,
    ),
    isFragile: parseImportBoolean(getImportCellValue(row, headerMap, ["isFragile", "fragile"]), false),
    isHazardous: parseImportBoolean(getImportCellValue(row, headerMap, ["isHazardous", "hazardous"]), false),
    isTemperatureControlled: parseImportBoolean(
      getImportCellValue(row, headerMap, ["isTemperatureControlled", "temperatureControlled"]),
      false,
    ),
    isInsured: parseImportBoolean(getImportCellValue(row, headerMap, ["isInsured", "insured"]), false),
    isCrossBorder: parseImportBoolean(getImportCellValue(row, headerMap, ["isCrossBorder", "crossBorder"]), false),
    currencyCode: toImportString(getImportCellValue(row, headerMap, ["currencyCode", "currency"])) || "USD",
    shippingTerms:
      toImportString(getImportCellValue(row, headerMap, ["shippingTerms", "terms"])) || undefined,
    incoterm: toImportString(getImportCellValue(row, headerMap, ["incoterm"])) || undefined,
    notes: toImportString(getImportCellValue(row, headerMap, ["notes"])) || undefined,
    internalNotes:
      toImportString(getImportCellValue(row, headerMap, ["internalNotes", "internal"])) || undefined,
  };
}

function validateValues(values: ShipmentUpsertPayload) {
  const issues: string[] = [];
  if (!values.originAddressId) {
    issues.push("Missing origin address ID");
  }
  if (!values.destinationAddressId) {
    issues.push("Missing destination address ID");
  }
  if (!values.priority) {
    issues.push("Missing shipment priority");
  }
  if (!values.currencyCode) {
    issues.push("Missing currency code");
  }
  return issues;
}

export function ShipmentsBulkImportPage() {
  return (
    <BulkImportWorkflowPage<ShipmentUpsertPayload, Shipment>
      title="Bulk Shipment Import"
      backTo="/shipments/records"
      backLabel="Back to Shipments"
      entityLabel="shipment"
      entityLabelPlural="shipments"
      intro="Upload a CSV or Excel file, map it into shipment create fields, and preview exactly what will be imported."
      fields={fields}
      emptyState="Upload a CSV or XLSX file to preview mapped shipment rows."
      mapSpreadsheetRow={mapSpreadsheetRow}
      validateValues={validateValues}
      saveBulk={(body) => shipmentsApi.createShipmentsBulk(body)}
      uploadDescription="For `.xlsx`, the first worksheet is used. Include the related address and carrier IDs directly in the file when you prepare shipment imports."
      tableMaxWidth={{ xs: "100%", lg: 1200, xl: 1400 }}
    />
  );
}
