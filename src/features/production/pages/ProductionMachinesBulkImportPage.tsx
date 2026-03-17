import { Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { BulkImportWorkflowPage, type BulkImportFieldConfig } from "@app/components/forms/BulkImportWorkflowPage";
import {
  getImportCellValue,
  parseImportBoolean,
  parseImportEnum,
  parseImportNumber,
  toImportString,
} from "@app/components/forms/bulkImport.utils";
import { productionApi } from "@features/production/services/production.api.service";
import {
  MachineStatus,
  type Machine,
  type MachineUpsertPayload,
  type WorkCenter,
} from "@features/production/types/production.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

const fields: BulkImportFieldConfig<MachineUpsertPayload>[] = [
  { name: "machineCode", label: "Machine Code", width: 150 },
  { name: "name", label: "Machine Name", width: 220 },
  { name: "workCenterId", label: "Work Center ID", width: 200 },
  { name: "model", label: "Model", width: 160 },
  { name: "manufacturer", label: "Manufacturer", width: 180 },
  { name: "serialNumber", label: "Serial Number", width: 180 },
  { name: "hourlyRunningCost", label: "Hourly Cost", kind: "number", width: 140 },
  {
    name: "status",
    label: "Status",
    kind: "select",
    width: 130,
    options: [
      { label: "Idle", value: MachineStatus.Idle },
      { label: "Running", value: MachineStatus.Running },
      { label: "Down", value: MachineStatus.Down },
      { label: "Maintenance", value: MachineStatus.Maintenance },
      { label: "Retired", value: MachineStatus.Retired },
    ],
  },
  { name: "lastMaintenanceDate", label: "Last Maintenance", kind: "date", width: 180 },
  { name: "nextMaintenanceDate", label: "Next Maintenance", kind: "date", width: 180 },
  { name: "isActive", label: "Active", kind: "boolean", width: 110 },
];

function findWorkCenterId(workCenters: WorkCenter[], rawValue: unknown) {
  const normalized = toImportString(rawValue);
  if (!normalized) {
    return "";
  }

  const directMatch = workCenters.find(
    (workCenter) =>
      workCenter.id === normalized ||
      workCenter.code.toLowerCase() === normalized.toLowerCase() ||
      workCenter.name.toLowerCase() === normalized.toLowerCase(),
  );

  return directMatch?.id ?? normalized;
}

function validateValues(values: MachineUpsertPayload) {
  const issues: string[] = [];
  if (!values.machineCode) {
    issues.push("Missing machine code");
  }
  if (!values.name) {
    issues.push("Missing machine name");
  }
  if (!values.workCenterId) {
    issues.push("Missing work center ID");
  }
  if (!Number.isFinite(values.hourlyRunningCost)) {
    issues.push("Hourly running cost is not valid");
  }
  return issues;
}

export function ProductionMachinesBulkImportPage() {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [workCenterError, setWorkCenterError] = useState<string | null>(null);

  useEffect(() => {
    void productionApi
      .listWorkCenters({ pageNumber: 1, pageSize: 500 })
      .then((response) => {
        setWorkCenters(getApiData(response, []));
        setWorkCenterError(null);
      })
      .catch((error) => setWorkCenterError(getErrorMessage(error, "Failed to load work centers.")));
  }, []);

  return (
    <>
      {workCenterError ? <Alert severity="warning">{workCenterError}</Alert> : null}
      <BulkImportWorkflowPage<MachineUpsertPayload, Machine>
        title="Bulk Machine Import"
        backTo="/production/machines"
        backLabel="Back to Machines"
        entityLabel="machine"
        entityLabelPlural="machines"
        intro="Upload a CSV or Excel file, map it into machine create fields, and preview exactly what will be imported."
        fields={fields}
        emptyState="Upload a CSV or XLSX file to preview mapped machine rows."
        mapSpreadsheetRow={({ row, headerMap }) => ({
          machineCode: toImportString(getImportCellValue(row, headerMap, ["machineCode", "code"])),
          name: toImportString(getImportCellValue(row, headerMap, ["name", "machine", "machineName"])),
          workCenterId: findWorkCenterId(
            workCenters,
            getImportCellValue(row, headerMap, ["workCenterId", "workCenter", "workCenterCode"]),
          ),
          model: toImportString(getImportCellValue(row, headerMap, ["model"])) || undefined,
          manufacturer: toImportString(getImportCellValue(row, headerMap, ["manufacturer"])) || undefined,
          serialNumber: toImportString(getImportCellValue(row, headerMap, ["serialNumber", "serial"])) || undefined,
          hourlyRunningCost: parseImportNumber(
            getImportCellValue(row, headerMap, ["hourlyRunningCost", "runningCost", "hourlyCost"]),
            0,
          ),
          status: parseImportEnum(
            getImportCellValue(row, headerMap, ["status", "machineStatus"]),
            MachineStatus,
            MachineStatus.Idle,
          ),
          lastMaintenanceDate:
            toImportString(getImportCellValue(row, headerMap, ["lastMaintenanceDate", "lastMaintenance"])) ||
            undefined,
          nextMaintenanceDate:
            toImportString(getImportCellValue(row, headerMap, ["nextMaintenanceDate", "nextMaintenance"])) ||
            undefined,
          isActive: parseImportBoolean(
            getImportCellValue(row, headerMap, ["isActive", "active", "enabled"]),
            true,
          ),
        })}
        validateValues={validateValues}
        saveBulk={(body) => productionApi.createMachinesBulk(body)}
        uploadDescription="For `.xlsx`, the first worksheet is used. Work center values can be entered as a work-center ID, code, or exact name."
      />
    </>
  );
}
