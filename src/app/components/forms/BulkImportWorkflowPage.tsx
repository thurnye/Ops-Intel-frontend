import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import toast from "react-hot-toast";
import { Link as RouterLink } from "react-router-dom";
import * as XLSX from "xlsx";
import type { ApiResponse } from "@shared/types/api.types";
import type { BulkCreatePayload, BulkCreateResponse } from "@shared/types/bulk.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { buildImportHeaderMap, toImportString } from "@app/components/forms/bulkImport.utils";

type ImportFileType = "csv" | "xlsx";
type ImportFileTypeOption = ImportFileType | "";

type Primitive = string | number | boolean | null | undefined;

export type BulkImportFieldOption = {
  label: string;
  value: string | number | boolean;
};

export type BulkImportFieldConfig<TPayload> = {
  name: keyof TPayload & string;
  label: string;
  kind?: "text" | "multiline" | "number" | "boolean" | "date" | "select";
  width?: number;
  renderPreview?: (value: TPayload[keyof TPayload], row: PreviewRow<TPayload>) => ReactNode;
  options?: BulkImportFieldOption[];
};

export type PreviewRow<TPayload> = TPayload & {
  rowId: string;
  sourceRowNumber: number;
  validationIssues: string[];
  changedFields: Array<keyof TPayload & string>;
  originalValues: TPayload;
  saveState: "idle" | "saved" | "failed";
  saveError?: string;
  savedEntityId?: string;
};

type BulkImportWorkflowPageProps<TPayload extends Record<string, Primitive>, TResponse> = {
  title: string;
  backTo: string;
  backLabel: string;
  entityLabel: string;
  entityLabelPlural: string;
  intro: string;
  fields: BulkImportFieldConfig<TPayload>[];
  emptyState: string;
  mapSpreadsheetRow: (args: {
    row: unknown[];
    headerMap: Record<string, number>;
    sourceRowNumber: number;
  }) => TPayload;
  validateValues: (values: TPayload) => string[];
  saveBulk: (
    body: BulkCreatePayload<TPayload>,
  ) => Promise<ApiResponse<BulkCreateResponse<TResponse>>>;
  getSavedEntityId?: (response: TResponse) => string | undefined;
  savePayloadMapper?: (values: TPayload) => TPayload;
  uploadDescription?: string;
  previewDescription?: string;
  saveChipLabel?: string;
  tableMinWidth?: string | number | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", string | number>>;
  tableMaxWidth?: string | number | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", string | number>>;
};

function defaultFormatPreviewValue(value: Primitive) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  const normalized = toImportString(value);
  return normalized || "—";
}

export function BulkImportWorkflowPage<
  TPayload extends Record<string, Primitive>,
  TResponse extends { id?: string },
>({
  title,
  backTo,
  backLabel,
  entityLabel,
  entityLabelPlural,
  intro,
  fields,
  emptyState,
  mapSpreadsheetRow,
  validateValues,
  saveBulk,
  getSavedEntityId,
  savePayloadMapper,
  uploadDescription,
  previewDescription,
  saveChipLabel = "Bulk save enabled",
  tableMinWidth = 750,
  tableMaxWidth = { xs: "100%", lg: 1150, xl: 1400 },
}: BulkImportWorkflowPageProps<TPayload, TResponse>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileType, setFileType] = useState<ImportFileTypeOption>("");
  const [sourceMenuAnchorEl, setSourceMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [savingBulk, setSavingBulk] = useState(false);
  const [previewRows, setPreviewRows] = useState<Array<PreviewRow<TPayload>>>([]);
  const [editingRow, setEditingRow] = useState<PreviewRow<TPayload> | null>(null);

  const fieldLabels = useMemo(
    () =>
      fields.reduce<Record<string, string>>((accumulator, field) => {
        accumulator[field.name] = field.label;
        return accumulator;
      }, {}),
    [fields],
  );

  function getChangedFields(currentValues: TPayload, originalValues: TPayload) {
    return fields
      .map((field) => field.name)
      .filter((fieldName) => currentValues[fieldName] !== originalValues[fieldName]);
  }

  const previewColumns = useMemo<AppDataTableColumnDef<PreviewRow<TPayload>>[]>(
    () => [
      { accessorKey: "sourceRowNumber", header: "Row", meta: { width: 72 } },
      ...fields.map<AppDataTableColumnDef<PreviewRow<TPayload>>>((field) => ({
        accessorKey: field.name,
        header: field.label,
        meta: { width: field.width ?? 180 },
        cell: ({ row }) =>
          field.renderPreview
            ? field.renderPreview(row.original[field.name], row.original)
            : defaultFormatPreviewValue(row.original[field.name]),
      })),
      {
        accessorKey: "validationIssues",
        header: "Import Check",
        meta: { width: 140 },
        cell: ({ row }) =>
          row.original.validationIssues.length === 0 ? (
            <Chip
              icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />}
              size="small"
              label="Ready"
              sx={{ bgcolor: alpha("#16a34a", 0.12), color: "#15803d", fontWeight: 700 }}
            />
          ) : (
            <Chip
              icon={<WarningAmberRoundedIcon sx={{ fontSize: 16 }} />}
              size="small"
              label={`${row.original.validationIssues.length} issue${row.original.validationIssues.length > 1 ? "s" : ""}`}
              sx={{ bgcolor: alpha("#f59e0b", 0.14), color: "#b45309", fontWeight: 700 }}
            />
          ),
      },
      {
        accessorKey: "changedFields",
        header: "Updated",
        meta: { width: 130, align: "center" },
        cell: ({ row }) =>
          row.original.changedFields.length > 0 ? (
            <Chip
              size="small"
              label={`${row.original.changedFields.length} updated`}
              sx={{ bgcolor: alpha("#7c3aed", 0.12), color: "#6d28d9", fontWeight: 700 }}
            />
          ) : (
            <Chip
              size="small"
              label="Original"
              sx={{ bgcolor: "#f8fafc", color: "#64748b", fontWeight: 700 }}
            />
          ),
      },
      {
        accessorKey: "saveState",
        header: "Save Status",
        meta: { width: 150, align: "center" },
        cell: ({ row }) => {
          if (row.original.saveState === "saved") {
            return (
              <Chip
                size="small"
                label="Saved"
                sx={{ bgcolor: alpha("#16a34a", 0.12), color: "#15803d", fontWeight: 700 }}
              />
            );
          }

          if (row.original.saveState === "failed") {
            return (
              <Chip
                size="small"
                label="Failed"
                sx={{ bgcolor: alpha("#dc2626", 0.12), color: "#b91c1c", fontWeight: 700 }}
              />
            );
          }

          return (
            <Chip
              size="small"
              label="Not saved"
              sx={{ bgcolor: "#f8fafc", color: "#64748b", fontWeight: 700 }}
            />
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        meta: { width: 170, align: "center" },
        cell: ({ row }) => (
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              size="small"
              variant="text"
              startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => setEditingRow(row.original)}
              disabled={row.original.saveState === "saved"}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              variant="text"
              startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() =>
                setPreviewRows((currentRows) =>
                  currentRows.filter((item) => item.rowId !== row.original.rowId),
                )
              }
            >
              Delete
            </Button>
          </Stack>
        ),
      },
    ],
    [fields],
  );

  const issuesCount = previewRows.reduce((sum, row) => sum + row.validationIssues.length, 0);
  const readyRowsCount = previewRows.filter((row) => row.validationIssues.length === 0).length;

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setParsing(true);
      setUploadedFileName(file.name);
      setError(null);

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: "" });

      if (rows.length < 2) {
        setPreviewRows([]);
        setError("The selected file does not contain any data rows.");
        return;
      }

      const [headerRow, ...dataRows] = rows as string[][];
      const headerMap = buildImportHeaderMap(headerRow.map((value) => String(value ?? "")));
      const mappedRows = dataRows
        .filter((row) => row.some((cell) => toImportString(cell) !== ""))
        .map((row, index) => {
          const mappedValues = mapSpreadsheetRow({
            row,
            headerMap,
            sourceRowNumber: index + 2,
          });

          return {
            ...mappedValues,
            rowId: `${index + 2}-${entityLabel}`,
            sourceRowNumber: index + 2,
            validationIssues: validateValues(mappedValues),
            changedFields: [],
            originalValues: { ...mappedValues },
            saveState: "idle" as const,
          };
        });

      setPreviewRows(mappedRows);
      setIsUploadModalOpen(false);
    } catch (parseError) {
      setPreviewRows([]);
      setError(getErrorMessage(parseError, "Failed to parse the selected file."));
    } finally {
      setParsing(false);
      event.target.value = "";
    }
  }

  function openUploadModal(nextType: ImportFileType) {
    setFileType(nextType);
    setSourceMenuAnchorEl(null);
    setIsUploadModalOpen(true);
  }

  function updateEditingRow<K extends keyof PreviewRow<TPayload>>(field: K, value: PreviewRow<TPayload>[K]) {
    setEditingRow((currentRow) => (currentRow ? { ...currentRow, [field]: value } : currentRow));
  }

  function saveEditingRow() {
    if (!editingRow) {
      return;
    }

    const nextValues = fields.reduce<TPayload>((accumulator, field) => {
      accumulator[field.name] = editingRow[field.name];
      return accumulator;
    }, {} as TPayload);

    const nextRow: PreviewRow<TPayload> = {
      ...editingRow,
      validationIssues: validateValues(nextValues),
      changedFields: getChangedFields(nextValues, editingRow.originalValues),
      saveState: "idle",
      saveError: undefined,
      savedEntityId: undefined,
    };

    setPreviewRows((currentRows) =>
      currentRows.map((row) => (row.rowId === nextRow.rowId ? nextRow : row)),
    );
    setEditingRow(null);
  }

  async function handleSaveBulk() {
    if (previewRows.length === 0) {
      return;
    }

    const rowsToSave = previewRows.filter((row) => row.saveState !== "saved");
    if (rowsToSave.length === 0) {
      toast(`All imported ${entityLabelPlural} are already saved.`);
      return;
    }

    try {
      setSavingBulk(true);
      const response = await saveBulk({
        items: rowsToSave.map((row) => {
          const saveValues = fields.reduce<TPayload>((accumulator, field) => {
            accumulator[field.name] = row[field.name];
            return accumulator;
          }, {} as TPayload);

          return {
            clientRowId: row.rowId,
            sourceRowNumber: row.sourceRowNumber,
            payload: savePayloadMapper ? savePayloadMapper(saveValues) : saveValues,
          };
        }),
      });

      const bulkResponse = getApiData(response, null);
      const resultMap = new Map(
        (bulkResponse?.results ?? []).map((result) => [
          result.clientRowId ?? `${result.sourceRowNumber}`,
          result,
        ]),
      );

      setPreviewRows((currentRows) =>
        currentRows.map((row) => {
          const result = resultMap.get(row.rowId) ?? resultMap.get(`${row.sourceRowNumber}`);
          if (!result) {
            return row;
          }

          return {
            ...row,
            saveState: result.success ? "saved" : "failed",
            saveError: result.errorMessage,
            savedEntityId: result.data
              ? (getSavedEntityId?.(result.data) ?? result.data.id)
              : undefined,
          };
        }),
      );

      const successCount = bulkResponse?.successCount ?? 0;
      const failureCount = bulkResponse?.failureCount ?? 0;

      if (successCount > 0 && failureCount === 0) {
        toast.success(`Saved ${successCount} ${entityLabel}${successCount > 1 ? "s" : ""}.`);
      } else if (successCount > 0) {
        toast.success(
          `Saved ${successCount} ${entityLabel}${successCount > 1 ? "s" : ""}; ${failureCount} failed.`,
        );
      } else {
        toast.error(`No ${entityLabelPlural} were saved.`);
      }
    } catch (saveError) {
      toast.error(getErrorMessage(saveError, `Failed to save imported ${entityLabelPlural}.`));
    } finally {
      setSavingBulk(false);
    }
  }

  return (
    <Container maxWidth="xl" disableGutters className="space-y-5">
      <Box>
        <RouterLink
          className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800"
          to={backTo}
        >
          <ArrowBackIcon sx={{ fontSize: 14 }} /> {backLabel}
        </RouterLink>
        <Typography variant="h4" mt={1} sx={{ fontSize: { xs: 30, md: 34 } }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: { xs: 13.5, md: 14 }, color: "#64748b", mt: 0.5 }}>
          {intro}
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Stack direction={{ xs: "column", xl: "row" }} spacing={3}>
        <Card sx={{ flex: 1.1, minWidth: 0, borderRadius: "24px", border: "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: { xs: 18, md: 20 }, fontWeight: 800, color: "#0f172a" }}>
                  Import Source
                </Typography>
                <Typography sx={{ mt: 0.75, fontSize: { xs: 13.5, md: 14 }, color: "#64748b" }}>
                  Choose whether you want to import from a CSV file or an Excel workbook.
                </Typography>
              </Box>

              <Box sx={{ width: "100%", maxWidth: 280 }}>
                <Typography
                  sx={{
                    mb: 0.75,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Source
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={(event) => setSourceMenuAnchorEl(event.currentTarget)}
                  sx={{
                    justifyContent: "space-between",
                    borderColor: "#cbd5e1",
                    color: fileType ? "#0f172a" : "#94a3b8",
                    bgcolor: "white",
                    py: 1.1,
                    px: 1.5,
                    textTransform: "none",
                  }}
                >
                  {fileType ? `Add .${fileType} file` : "Select source"}
                </Button>
                <Menu
                  anchorEl={sourceMenuAnchorEl}
                  open={Boolean(sourceMenuAnchorEl)}
                  onClose={() => setSourceMenuAnchorEl(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem
                    onClick={() => {
                      setFileType("");
                      setSourceMenuAnchorEl(null);
                    }}
                  >
                    Select source
                  </MenuItem>
                  <MenuItem onClick={() => openUploadModal("csv")}>Add .csv file</MenuItem>
                  <MenuItem onClick={() => openUploadModal("xlsx")}>Add .xlsx file</MenuItem>
                </Menu>
              </Box>

              {uploadedFileName ? (
                <Typography sx={{ fontSize: 13, color: "#334155" }}>
                  Loaded file:{" "}
                  <Box component="span" sx={{ fontWeight: 700 }}>
                    {uploadedFileName}
                  </Box>
                </Typography>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Card sx={{ flex: 1, minWidth: 0, borderRadius: "22px", border: "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}>
              Rows Parsed
            </Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>
              {previewRows.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 0, borderRadius: "22px", border: "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}>
              Ready Rows
            </Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#15803d" }}>
              {readyRowsCount}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 0, borderRadius: "22px", border: "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}>
              Validation Issues
            </Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: issuesCount === 0 ? "#0f172a" : "#b45309" }}>
              {issuesCount}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Card sx={{ borderRadius: "24px", border: "1px solid #e2e8f0" }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.25}
              justifyContent="space-between"
              alignItems={{ md: "center" }}
            >
              <Box>
                <Typography sx={{ fontSize: { xs: 18, md: 20 }, fontWeight: 800, color: "#0f172a" }}>
                  Imported {entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1)} Preview
                </Typography>
                <Typography sx={{ fontSize: { xs: 13.5, md: 14 }, color: "#64748b", mt: 0.4 }}>
                  {previewDescription ??
                    `The data below is normalized into the ${entityLabel} create shape and ready for backend bulk save.`}
                </Typography>
              </Box>
              <Chip
                icon={<InfoOutlinedIcon sx={{ fontSize: 16 }} />}
                label={saveChipLabel}
                sx={{ bgcolor: alpha("#16a34a", 0.12), color: "#15803d", fontWeight: 700 }}
              />
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ sm: "center" }}
            >
              <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                Save imported rows to the backend and track each row directly in the preview table.
              </Typography>
              <Button variant="contained" onClick={handleSaveBulk} disabled={previewRows.length === 0 || savingBulk}>
                {savingBulk ? "Saving..." : "Save Imported Rows"}
              </Button>
            </Stack>

            <AppDataTable
              columns={previewColumns}
              data={previewRows}
              emptyState={emptyState}
              initialPageSize={10}
              pageSizeOptions={[10, 25, 50]}
              tableMinWidth={tableMinWidth}
              tableMaxWidth={tableMaxWidth}
              maxBodyHeight={520}
            />

            {previewRows.some((row) => row.validationIssues.length > 0) ? (
              <Alert severity="warning">
                Some rows are missing required {entityLabel} values and need to be fixed before import.
              </Alert>
            ) : null}
            {previewRows.some((row) => row.saveState === "failed" && row.saveError) ? (
              <Alert severity="error">
                Failed rows:{" "}
                {previewRows
                  .filter((row) => row.saveState === "failed" && row.saveError)
                  .map((row) => `row ${row.sourceRowNumber}: ${row.saveError}`)
                  .join(" | ")}
              </Alert>
            ) : null}
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={isUploadModalOpen}
        onClose={() => {
          if (!parsing) {
            setIsUploadModalOpen(false);
          }
        }}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "24px",
              border: "1px solid #dbe4ee",
              boxShadow: "0 28px 60px rgba(15, 23, 42, 0.18)",
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1.25 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Upload {fileType.toUpperCase()} {entityLabel} sheet
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: 14, color: "#64748b" }}>
            Parse your file in the browser and preview the mapped {entityLabelPlural} on this page.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 3 }}>
          <Box
            sx={{
              borderRadius: "24px",
              border: "1px dashed #94a3b8",
              bgcolor: "#f8fafc",
              p: { xs: 2.5, md: 3.5 },
            }}
          >
            <Stack spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "18px",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: alpha("#2563eb", 0.1),
                  color: "#2563eb",
                }}
              >
                <FileUploadOutlinedIcon />
              </Box>
              <Box>
                <Typography sx={{ fontSize: { xs: 17, md: 18 }, fontWeight: 800, color: "#0f172a" }}>
                  Upload a {fileType.toUpperCase()} {entityLabel} sheet
                </Typography>
                <Typography sx={{ mt: 0.75, fontSize: 13.5, color: "#64748b", maxWidth: 620 }}>
                  {uploadDescription ??
                    "For `.xlsx`, the first worksheet is used. This page is for preview, row cleanup, and bulk save."}
                </Typography>
              </Box>
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept={
                  fileType === "csv"
                    ? ".csv,text/csv"
                    : ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
                onChange={handleFileSelected}
              />
              <Button
                variant="contained"
                startIcon={<UploadFileOutlinedIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={parsing}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {parsing ? "Parsing file..." : `Select ${fileType.toUpperCase()} file`}
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingRow)}
        onClose={() => setEditingRow(null)}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: "24px", border: "1px solid #dbe4ee" } } }}
      >
        <DialogTitle sx={{ pb: 1.25 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Edit Imported {entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1)} Row
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: 14, color: "#64748b" }}>
            Update the preview data before import. Changes apply only to the frontend preview rows.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 2 }}>
          {editingRow ? (
            <Stack spacing={3} sx={{ pt: 1 }}>
              {fields.map((field) => {
                const value = editingRow[field.name];

                if (field.kind === "multiline") {
                  return (
                    <TextField
                      key={field.name}
                      label={field.label}
                      size="small"
                      fullWidth
                      multiline
                      minRows={4}
                      value={toImportString(value)}
                      onChange={(event) =>
                        updateEditingRow(field.name, event.target.value as PreviewRow<TPayload>[keyof PreviewRow<TPayload>])
                      }
                    />
                  );
                }

                if (field.kind === "select") {
                  return (
                    <TextField
                      key={field.name}
                      select
                      label={field.label}
                      size="small"
                      fullWidth
                      value={String(value ?? "")}
                      onChange={(event) => {
                        const matchedOption = field.options?.find(
                          (option) => String(option.value) === event.target.value,
                        );
                        updateEditingRow(
                          field.name,
                          (matchedOption?.value ?? event.target.value) as PreviewRow<TPayload>[keyof PreviewRow<TPayload>],
                        );
                      }}
                    >
                      {(field.options ?? []).map((option) => (
                        <MenuItem key={`${field.name}-${String(option.value)}`} value={String(option.value)}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                }

                if (field.kind === "boolean") {
                  return (
                    <TextField
                      key={field.name}
                      select
                      label={field.label}
                      size="small"
                      fullWidth
                      value={String(Boolean(value))}
                      onChange={(event) =>
                        updateEditingRow(
                          field.name,
                          (event.target.value === "true") as PreviewRow<TPayload>[keyof PreviewRow<TPayload>],
                        )
                      }
                    >
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </TextField>
                  );
                }

                return (
                  <TextField
                    key={field.name}
                    label={field.label}
                    type={field.kind === "number" ? "number" : field.kind === "date" ? "datetime-local" : "text"}
                    size="small"
                    fullWidth
                    value={value == null ? "" : String(value)}
                    onChange={(event) => {
                      const nextValue =
                        field.kind === "number"
                          ? Number(event.target.value || 0)
                          : event.target.value;
                      updateEditingRow(
                        field.name,
                        nextValue as PreviewRow<TPayload>[keyof PreviewRow<TPayload>],
                      );
                    }}
                    slotProps={field.kind === "date" ? { inputLabel: { shrink: true } } : undefined}
                  />
                );
              })}

              {editingRow.validationIssues.length > 0 ? (
                <Alert severity="warning">{editingRow.validationIssues.join(". ")}</Alert>
              ) : null}
              {getChangedFields(
                fields.reduce<TPayload>((accumulator, field) => {
                  accumulator[field.name] = editingRow[field.name];
                  return accumulator;
                }, {} as TPayload),
                editingRow.originalValues,
              ).length > 0 ? (
                <Alert severity="info">
                  Updated fields:{" "}
                  {getChangedFields(
                    fields.reduce<TPayload>((accumulator, field) => {
                      accumulator[field.name] = editingRow[field.name];
                      return accumulator;
                    }, {} as TPayload),
                    editingRow.originalValues,
                  )
                    .map((fieldName) => fieldLabels[fieldName])
                    .join(", ")}
                </Alert>
              ) : null}
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => setEditingRow(null)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveEditingRow}>
            Save Row
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
