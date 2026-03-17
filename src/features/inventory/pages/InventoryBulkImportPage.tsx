import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
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
  FormControlLabel,
  Menu,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { Link as RouterLink } from 'react-router-dom';
import * as XLSX from 'xlsx';
import type { AppDataTableColumnDef } from '@app/components/AppDataTable';
import { AppDataTable } from '@app/components/AppDataTable';
import { FieldHelp } from '@app/components/FieldHelp';
import {
  productFormDefaultValues,
  productImportFieldLabels,
  productImportFieldOrder,
  type ProductFormValues,
} from '@features/inventory/config/productForm.config';
import { inventoryApi } from '@features/inventory/services/inventory.api.service';
import {
  ProductStatus,
  type Brand,
  type Category,
  type UnitOfMeasure,
} from '@features/inventory/types/inventory.types';
import { getApiData, getErrorMessage } from '@shared/utils/asyncThunk.utils';

type ImportFileType = 'csv' | 'xlsx';
type ImportFileTypeOption = ImportFileType | '';

type PreviewRow = ProductFormValues & {
  rowId: string;
  sourceRowNumber: number;
  validationIssues: string[];
  changedFields: Array<keyof ProductFormValues>;
  originalValues: ProductFormValues;
  saveState: 'idle' | 'saved' | 'failed';
  saveError?: string;
  savedProductId?: string;
};

const booleanTrueValues = new Set(['true', '1', 'yes', 'y', 'on']);
const statusByNormalizedValue: Record<string, ProductStatus> = {
  '1': ProductStatus.Draft,
  draft: ProductStatus.Draft,
  '2': ProductStatus.Active,
  active: ProductStatus.Active,
  '3': ProductStatus.Inactive,
  inactive: ProductStatus.Inactive,
  '4': ProductStatus.Discontinued,
  discontinued: ProductStatus.Discontinued,
};

function normalizeHeader(value: string) {
  return value.replace(/[^a-z0-9]+/gi, '').toLowerCase();
}

function toStringValue(value: unknown) {
  return typeof value === 'string'
    ? value.trim()
    : value == null
      ? ''
      : String(value).trim();
}

function toNumberValue(value: unknown, fallback = 0) {
  const nextValue = Number(toStringValue(value));
  return Number.isFinite(nextValue) ? nextValue : fallback;
}

function toBooleanValue(value: unknown, fallback: boolean) {
  const stringValue = toStringValue(value).toLowerCase();
  if (!stringValue) {
    return fallback;
  }
  return booleanTrueValues.has(stringValue);
}

function toStatusValue(value: unknown) {
  return (
    statusByNormalizedValue[toStringValue(value).toLowerCase()] ??
    ProductStatus.Active
  );
}

function buildHeaderMap(headerRow: string[]) {
  return headerRow.reduce<Record<string, number>>(
    (accumulator, header, index) => {
      accumulator[normalizeHeader(header)] = index;
      return accumulator;
    },
    {},
  );
}

function getCellValue(
  row: unknown[],
  headerMap: Record<string, number>,
  aliases: string[],
) {
  for (const alias of aliases) {
    const index = headerMap[normalizeHeader(alias)];
    if (index != null) {
      return row[index];
    }
  }
  return undefined;
}

function statusLabel(status: ProductStatus) {
  switch (status) {
    case ProductStatus.Draft:
      return 'Draft';
    case ProductStatus.Active:
      return 'Active';
    case ProductStatus.Inactive:
      return 'Inactive';
    case ProductStatus.Discontinued:
      return 'Discontinued';
    default:
      return 'Unknown';
  }
}

function mapRowToProductValues(
  row: unknown[],
  headerMap: Record<string, number>,
  categories: Category[],
  brands: Brand[],
  units: UnitOfMeasure[],
  sourceRowNumber: number,
): PreviewRow {
  const categoryRaw = toStringValue(
    getCellValue(row, headerMap, ['categoryId', 'category', 'categoryName']),
  );
  const brandRaw = toStringValue(
    getCellValue(row, headerMap, ['brandId', 'brand', 'brandName']),
  );
  const unitRaw = toStringValue(
    getCellValue(row, headerMap, [
      'unitOfMeasureId',
      'unit',
      'unitOfMeasure',
      'unitName',
    ]),
  );

  const matchedCategory = categories.find(
    (item) =>
      item.id === categoryRaw ||
      item.name.toLowerCase() === categoryRaw.toLowerCase(),
  );
  const matchedBrand = brands.find(
    (item) =>
      item.id === brandRaw ||
      item.name.toLowerCase() === brandRaw.toLowerCase(),
  );
  const matchedUnit = units.find(
    (item) =>
      item.id === unitRaw ||
      item.name.toLowerCase() === unitRaw.toLowerCase() ||
      item.symbol.toLowerCase() === unitRaw.toLowerCase(),
  );

  const values: ProductFormValues = {
    ...productFormDefaultValues,
    name: toStringValue(getCellValue(row, headerMap, ['name', 'productName'])),
    description: toStringValue(getCellValue(row, headerMap, ['description'])),
    sku: toStringValue(getCellValue(row, headerMap, ['sku'])),
    barcode: toStringValue(getCellValue(row, headerMap, ['barcode'])),
    categoryId: matchedCategory?.id ?? categoryRaw,
    brandId: matchedBrand?.id ?? brandRaw,
    unitOfMeasureId: matchedUnit?.id ?? unitRaw,
    costPrice: toNumberValue(
      getCellValue(row, headerMap, ['costPrice', 'cost']),
    ),
    sellingPrice: toNumberValue(
      getCellValue(row, headerMap, ['sellingPrice', 'price', 'selling']),
    ),
    taxRate: toNumberValue(getCellValue(row, headerMap, ['taxRate', 'tax'])),
    reorderLevel: toNumberValue(getCellValue(row, headerMap, ['reorderLevel'])),
    reorderQuantity: toNumberValue(
      getCellValue(row, headerMap, ['reorderQuantity']),
    ),
    trackInventory: toBooleanValue(
      getCellValue(row, headerMap, ['trackInventory']),
      productFormDefaultValues.trackInventory,
    ),
    allowBackOrder: toBooleanValue(
      getCellValue(row, headerMap, ['allowBackOrder']),
      productFormDefaultValues.allowBackOrder,
    ),
    isSerialized: toBooleanValue(
      getCellValue(row, headerMap, ['isSerialized']),
      productFormDefaultValues.isSerialized,
    ),
    isBatchTracked: toBooleanValue(
      getCellValue(row, headerMap, ['isBatchTracked']),
      productFormDefaultValues.isBatchTracked,
    ),
    isPerishable: toBooleanValue(
      getCellValue(row, headerMap, ['isPerishable']),
      productFormDefaultValues.isPerishable,
    ),
    weight: toNumberValue(getCellValue(row, headerMap, ['weight'])),
    length: toNumberValue(getCellValue(row, headerMap, ['length'])),
    width: toNumberValue(getCellValue(row, headerMap, ['width'])),
    height: toNumberValue(getCellValue(row, headerMap, ['height'])),
    status: toStatusValue(getCellValue(row, headerMap, ['status'])),
    thumbnailImageUrl: toStringValue(
      getCellValue(row, headerMap, [
        'thumbnailImageUrl',
        'thumbnail',
        'imageUrl',
      ]),
    ),
  };

  return {
    ...values,
    rowId: `${sourceRowNumber}-${values.sku || values.name || 'row'}`,
    sourceRowNumber,
    validationIssues: validatePreviewValues(values),
    changedFields: [],
    originalValues: { ...values },
    saveState: 'idle',
  };
}

function validatePreviewValues(values: ProductFormValues) {
  const validationIssues: string[] = [];
  if (!values.name) validationIssues.push('Missing product name');
  if (!values.sku) validationIssues.push('Missing SKU');
  if (!values.categoryId) validationIssues.push('Category could not be mapped');
  if (!values.unitOfMeasureId) validationIssues.push('Unit could not be mapped');
  return validationIssues;
}

function getChangedFields(
  currentValues: ProductFormValues,
  originalValues: ProductFormValues,
) {
  return productImportFieldOrder.filter(
    (field) => currentValues[field] !== originalValues[field],
  );
}

export function InventoryBulkImportPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileType, setFileType] = useState<ImportFileTypeOption>('');
  const [sourceMenuAnchorEl, setSourceMenuAnchorEl] =
    useState<HTMLElement | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadingReferences, setLoadingReferences] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [savingBulk, setSavingBulk] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [editingRow, setEditingRow] = useState<PreviewRow | null>(null);

  useEffect(() => {
    let active = true;

    async function loadReferences() {
      try {
        setLoadingReferences(true);
        const [categoriesResponse, brandsResponse, unitsResponse] =
          await Promise.all([
            inventoryApi.listCategories(),
            inventoryApi.listBrands(),
            inventoryApi.listUnits(),
          ]);

        if (!active) {
          return;
        }

        setCategories(getApiData(categoriesResponse, []));
        setBrands(getApiData(brandsResponse, []));
        setUnits(getApiData(unitsResponse, []));
        setError(null);
      } catch (loadError) {
        if (active) {
          setError(
            getErrorMessage(
              loadError,
              'Failed to load product reference data.',
            ),
          );
        }
      } finally {
        if (active) {
          setLoadingReferences(false);
        }
      }
    }

    void loadReferences();
    return () => {
      active = false;
    };
  }, []);

  const previewColumns = useMemo<AppDataTableColumnDef<PreviewRow>[]>(
    () => [
      {
        accessorKey: 'sourceRowNumber',
        header: 'Row',
        meta: { width: 72 },
      },
      ...productImportFieldOrder.map<AppDataTableColumnDef<PreviewRow>>(
        (field) => ({
          accessorKey: field,
          header: productImportFieldLabels[field],
          meta: {
            width:
              field === 'description' || field === 'thumbnailImageUrl'
                ? 220
                : 140,
            align: [
              'costPrice',
              'sellingPrice',
              'taxRate',
              'reorderLevel',
              'reorderQuantity',
              'weight',
              'length',
              'width',
              'height',
            ].includes(field)
              ? 'right'
              : 'left',
          },
          cell: ({ row }) => {
            const value = row.original[field];

            if (field === 'sku') {
              return (
                <Typography sx={{ fontSize: 12.5, fontFamily: 'monospace' }}>
                  {String(value || '—')}
                </Typography>
              );
            }

            if (field === 'categoryId') {
              return (
                categories.find((item) => item.id === value)?.name ??
                String(value || '—')
              );
            }

            if (field === 'brandId') {
              return (
                brands.find((item) => item.id === value)?.name ??
                String(value || '—')
              );
            }

            if (field === 'unitOfMeasureId') {
              const unit = units.find((item) => item.id === value);
              return unit
                ? `${unit.name} (${unit.symbol})`
                : String(value || '—');
            }

            if (field === 'status') {
              return (
                <Chip
                  size='small'
                  label={statusLabel(row.original.status)}
                  sx={{
                    fontWeight: 700,
                    bgcolor: alpha('#2563eb', 0.08),
                    color: '#2563eb',
                  }}
                />
              );
            }

            if (typeof value === 'boolean') {
              return value ? 'Yes' : 'No';
            }

            if (typeof value === 'number') {
              return value.toFixed(2);
            }

            return String(value || '—');
          },
        }),
      ),
      {
        accessorKey: 'validationIssues',
        header: 'Import Check',
        meta: { width: 140 },
        cell: ({ row }) =>
          row.original.validationIssues.length === 0 ? (
            <Chip
              icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />}
              size='small'
              label='Ready'
              sx={{
                bgcolor: alpha('#16a34a', 0.12),
                color: '#15803d',
                fontWeight: 700,
              }}
            />
          ) : (
            <Chip
              icon={<WarningAmberRoundedIcon sx={{ fontSize: 16 }} />}
              size='small'
              label={`${row.original.validationIssues.length} issue${row.original.validationIssues.length > 1 ? 's' : ''}`}
              sx={{
                bgcolor: alpha('#f59e0b', 0.14),
                color: '#b45309',
                fontWeight: 700,
              }}
            />
          ),
      },
      {
        accessorKey: 'changedFields',
        header: 'Updated',
        meta: { width: 130, align: 'center' },
        cell: ({ row }) =>
          row.original.changedFields.length > 0 ? (
            <Chip
              size='small'
              label={`${row.original.changedFields.length} updated`}
              sx={{
                bgcolor: alpha('#7c3aed', 0.12),
                color: '#6d28d9',
                fontWeight: 700,
              }}
            />
          ) : (
            <Chip
              size='small'
              label='Original'
              sx={{
                bgcolor: '#f8fafc',
                color: '#64748b',
                fontWeight: 700,
              }}
            />
          ),
      },
      {
        accessorKey: 'saveState',
        header: 'Save Status',
        meta: { width: 150, align: 'center' },
        cell: ({ row }) => {
          if (row.original.saveState === 'saved') {
            return (
              <Chip
                size='small'
                label='Saved'
                sx={{
                  bgcolor: alpha('#16a34a', 0.12),
                  color: '#15803d',
                  fontWeight: 700,
                }}
              />
            );
          }

          if (row.original.saveState === 'failed') {
            return (
              <Chip
                size='small'
                label='Failed'
                sx={{
                  bgcolor: alpha('#dc2626', 0.12),
                  color: '#b91c1c',
                  fontWeight: 700,
                }}
              />
            );
          }

          return (
            <Chip
              size='small'
              label='Not saved'
              sx={{
                bgcolor: '#f8fafc',
                color: '#64748b',
                fontWeight: 700,
              }}
            />
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        meta: { width: 170, align: 'center' },
        cell: ({ row }) => (
          <Stack direction='row' spacing={1} justifyContent='center'>
            <Button
              size='small'
              variant='text'
              startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => setEditingRow(row.original)}
              disabled={row.original.saveState === 'saved'}
            >
              Edit
            </Button>
            <Button
              size='small'
              color='error'
              variant='text'
              startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() => {
                setPreviewRows((currentRows) =>
                  currentRows.filter((item) => item.rowId !== row.original.rowId),
                );
                if (editingRow?.rowId === row.original.rowId) {
                  setEditingRow(null);
                }
              }}
            >
              Delete
            </Button>
          </Stack>
        ),
      },
    ],
    [brands, categories, editingRow?.rowId, units],
  );

  const issuesCount = previewRows.reduce(
    (sum, row) => sum + row.validationIssues.length,
    0,
  );
  const readyRowsCount = previewRows.filter(
    (row) => row.validationIssues.length === 0,
  ).length;

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
      const workbook = XLSX.read(buffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        defval: '',
      });

      if (rows.length < 2) {
        setPreviewRows([]);
        setError('The selected file does not contain any data rows.');
        return;
      }

      const [headerRow, ...dataRows] = rows as string[][];
      const headerMap = buildHeaderMap(
        headerRow.map((value) => String(value ?? '')),
      );
      const mappedRows = dataRows
        .filter((row) => row.some((cell) => toStringValue(cell) !== ''))
        .map((row, index) =>
          mapRowToProductValues(
            row,
            headerMap,
            categories,
            brands,
            units,
            index + 2,
          ),
        );

      setPreviewRows(mappedRows);
      setIsUploadModalOpen(false);
    } catch (parseError) {
      setPreviewRows([]);
      setError(
        getErrorMessage(parseError, 'Failed to parse the selected file.'),
      );
    } finally {
      setParsing(false);
      event.target.value = '';
    }
  }

  function openUploadModal(nextType: ImportFileType) {
    setFileType(nextType);
    setSourceMenuAnchorEl(null);
    setIsUploadModalOpen(true);
  }

  function updateEditingRow<K extends keyof PreviewRow>(field: K, value: PreviewRow[K]) {
    setEditingRow((currentRow) => (currentRow ? { ...currentRow, [field]: value } : currentRow));
  }

  function saveEditingRow() {
    if (!editingRow) {
      return;
    }

    const nextRow: PreviewRow = {
      ...editingRow,
      validationIssues: validatePreviewValues(editingRow),
      changedFields: getChangedFields(editingRow, editingRow.originalValues),
      saveState: 'idle',
      saveError: undefined,
      savedProductId: undefined,
    };

    setPreviewRows((currentRows) =>
      currentRows.map((row) => (row.rowId === nextRow.rowId ? nextRow : row)),
    );
    setEditingRow(null);
  }

  async function saveBulkProducts() {
    if (previewRows.length === 0) {
      return;
    }

    const rowsToSave = previewRows.filter((row) => row.saveState !== 'saved');
    if (rowsToSave.length === 0) {
      toast('All imported rows are already saved.');
      return;
    }

    try {
      setSavingBulk(true);

      const response = await inventoryApi.createProductsBulk({
        items: rowsToSave.map((row) => ({
          clientRowId: row.rowId,
          sourceRowNumber: row.sourceRowNumber,
          name: row.name,
          description: row.description || undefined,
          sku: row.sku,
          barcode: row.barcode || undefined,
          categoryId: row.categoryId,
          brandId: row.brandId || undefined,
          unitOfMeasureId: row.unitOfMeasureId,
          costPrice: row.costPrice,
          sellingPrice: row.sellingPrice,
          taxRate: row.taxRate,
          reorderLevel: row.reorderLevel,
          reorderQuantity: row.reorderQuantity,
          trackInventory: row.trackInventory,
          allowBackOrder: row.allowBackOrder,
          isSerialized: row.isSerialized,
          isBatchTracked: row.isBatchTracked,
          isPerishable: row.isPerishable,
          weight: row.weight,
          length: row.length,
          width: row.width,
          height: row.height,
          status: row.status,
          thumbnailImageUrl: row.thumbnailImageUrl || undefined,
        })),
      });

      const resultMap = new Map(
        (response.data?.results ?? []).map((result) => [
          result.clientRowId ?? `${result.sourceRowNumber}`,
          result,
        ]),
      );

      setPreviewRows((currentRows) =>
        currentRows.map((row) => {
          const result =
            resultMap.get(row.rowId) ??
            resultMap.get(`${row.sourceRowNumber}`);

          if (!result) {
            return row;
          }

          return {
            ...row,
            saveState: result.success ? 'saved' : 'failed',
            saveError: result.errorMessage,
            savedProductId: result.product?.id,
          };
        }),
      );

      const successCount = response.data?.successCount ?? 0;
      const failureCount = response.data?.failureCount ?? 0;

      if (successCount > 0 && failureCount === 0) {
        toast.success(`Saved ${successCount} product${successCount > 1 ? 's' : ''}.`);
      } else if (successCount > 0) {
        toast.success(`Saved ${successCount} product${successCount > 1 ? 's' : ''}; ${failureCount} failed.`);
      } else {
        toast.error('No products were saved.');
      }
    } catch (saveError) {
      toast.error(getErrorMessage(saveError, 'Failed to save imported products.'));
    } finally {
      setSavingBulk(false);
    }
  }

  return (
    <Container maxWidth={'xl'} disableGutters className='space-y-5'>
      <Box>
        <RouterLink
          className='mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800'
          to='/inventory/catalogs'
        >
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back to Catalogs
        </RouterLink>
        <Typography variant='h4' mt={1} sx={{ fontSize: { xs: 30, md: 34 } }}>
          Bulk Product Import
        </Typography>
        <Typography
          sx={{ fontSize: { xs: 13.5, md: 14 }, color: '#64748b', mt: 0.5 }}
        >
          Upload a CSV or Excel file, map it into product create fields, and
          preview exactly what will be imported.
        </Typography>
      </Box>

      {error ? <Alert severity='error'>{error}</Alert> : null}
      {loadingReferences ? (
        <Alert severity='info'>
          Loading categories, brands, and units for import mapping...
        </Alert>
      ) : null}

      <Stack direction={{ xs: 'column', xl: 'row' }} spacing={3}>
        <Card
          sx={{
            flex: 1.1,
            minWidth: 0,
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 20 },
                    fontWeight: 800,
                    color: '#0f172a',
                  }}
                >
                  Import Source
                </Typography>
                <Typography
                  sx={{
                    mt: 0.75,
                    fontSize: { xs: 13.5, md: 14 },
                    color: '#64748b',
                  }}
                >
                  Choose whether you want to import from a CSV file or an Excel
                  workbook.
                </Typography>
              </Box>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
              >
                <Box sx={{ width: '100%', maxWidth: 280 }}>
                  <Typography
                    sx={{
                      mb: 0.75,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#64748b',
                    }}
                  >
                    Source
                  </Typography>
                  <Button
                    variant='outlined'
                    fullWidth
                    onClick={(event) =>
                      setSourceMenuAnchorEl(event.currentTarget)
                    }
                    sx={{
                      justifyContent: 'space-between',
                      borderColor: '#cbd5e1',
                      color: fileType ? '#0f172a' : '#94a3b8',
                      bgcolor: 'white',
                      py: 1.1,
                      px: 1.5,
                      textTransform: 'none',
                    }}
                  >
                    {fileType ? `Add .${fileType} file` : 'Select source'}
                  </Button>
                  <Menu
                    anchorEl={sourceMenuAnchorEl}
                    open={Boolean(sourceMenuAnchorEl)}
                    onClose={() => setSourceMenuAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <MenuItem
                      onClick={() => {
                        setFileType('');
                        setSourceMenuAnchorEl(null);
                      }}
                    >
                      Select source
                    </MenuItem>
                    <MenuItem onClick={() => openUploadModal('csv')}>
                      Add .csv file
                    </MenuItem>
                    <MenuItem onClick={() => openUploadModal('xlsx')}>
                      Add .xlsx file
                    </MenuItem>
                  </Menu>
                </Box>
              </Stack>

              {uploadedFileName ? (
                <Typography sx={{ fontSize: 13, color: '#334155' }}>
                  Loaded file:{' '}
                  <Box component='span' sx={{ fontWeight: 700 }}>
                    {uploadedFileName}
                  </Box>
                </Typography>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Card
          sx={{
            flex: 1,
            minWidth: 0,
            borderRadius: '22px',
            border: '1px solid #e2e8f0',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#94a3b8',
              }}
            >
              Rows Parsed
            </Typography>
            <Typography
              sx={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}
            >
              {previewRows.length}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            minWidth: 0,
            borderRadius: '22px',
            border: '1px solid #e2e8f0',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#94a3b8',
              }}
            >
              Ready Rows
            </Typography>
            <Typography
              sx={{ fontSize: 28, fontWeight: 800, color: '#15803d' }}
            >
              {readyRowsCount}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            minWidth: 0,
            borderRadius: '22px',
            border: '1px solid #e2e8f0',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#94a3b8',
              }}
            >
              Validation Issues
            </Typography>
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 800,
                color: issuesCount === 0 ? '#0f172a' : '#b45309',
              }}
            >
              {issuesCount}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Card sx={{ borderRadius: '24px', border: '1px solid #e2e8f0' }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.25}
              justifyContent='space-between'
              alignItems={{ md: 'center' }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 20 },
                    fontWeight: 800,
                    color: '#0f172a',
                  }}
                >
                  Imported Product Preview
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 13.5, md: 14 },
                    color: '#64748b',
                    mt: 0.4,
                  }}
                >
                  The data below is normalized into the product create shape and
                  ready for future backend import wiring.
                </Typography>
              </Box>
              <Chip
                icon={<InfoOutlinedIcon sx={{ fontSize: 16 }} />}
                label='Bulk save enabled'
                sx={{
                  bgcolor: alpha('#16a34a', 0.12),
                  color: '#15803d',
                  fontWeight: 700,
                }}
              />
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent='space-between'
              alignItems={{ sm: 'center' }}
            >
              <Typography sx={{ fontSize: 13, color: '#64748b' }}>
                Saving uses the backend bulk endpoint. Rows are marked as saved or failed directly in the preview table.
              </Typography>
              <Button
                variant='contained'
                onClick={saveBulkProducts}
                disabled={previewRows.length === 0 || savingBulk}
              >
                {savingBulk ? 'Saving...' : 'Save Imported Rows'}
              </Button>
            </Stack>

            <AppDataTable
              columns={previewColumns}
              data={previewRows}
              emptyState='Upload a CSV or XLSX file to preview mapped product rows.'
              initialPageSize={10}
              pageSizeOptions={[10, 25, 50]}
              tableMinWidth={750}
              tableMaxWidth={{ xs: '100%', lg: 1150, xl: 1590 }}
              // maxBodyHeight={520}
            />

            {previewRows.some((row) => row.validationIssues.length > 0) ? (
              <Alert severity='warning'>
                Some rows are missing required product values or could not map
                category or unit columns to existing reference data.
              </Alert>
            ) : null}
            {previewRows.some((row) => row.saveState === 'failed' && row.saveError) ? (
              <Alert severity='error'>
                Failed rows:{' '}
                {previewRows
                  .filter((row) => row.saveState === 'failed' && row.saveError)
                  .map((row) => `row ${row.sourceRowNumber}: ${row.saveError}`)
                  .join(' | ')}
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
        maxWidth='sm'
        slotProps={{
          paper: {
            sx: {
              borderRadius: '24px',
              border: '1px solid #dbe4ee',
              boxShadow: '0 28px 60px rgba(15, 23, 42, 0.18)',
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1.25 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
            Upload {fileType.toUpperCase()} product sheet
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: 14, color: '#64748b' }}>
            Parse your file in the browser and preview the mapped product rows
            on this page.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 3 }}>
          <Box
            sx={{
              borderRadius: '24px',
              border: '1px dashed #94a3b8',
              bgcolor: '#f8fafc',
              p: { xs: 2.5, md: 3.5 },
            }}
          >
            <Stack spacing={2} alignItems='flex-start'>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '18px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: alpha('#2563eb', 0.1),
                  color: '#2563eb',
                }}
              >
                <FileUploadOutlinedIcon />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: 17, md: 18 },
                    fontWeight: 800,
                    color: '#0f172a',
                  }}
                >
                  Upload a {fileType.toUpperCase()} product sheet
                </Typography>
                <Typography
                  sx={{
                    mt: 0.75,
                    fontSize: 13.5,
                    color: '#64748b',
                    maxWidth: 620,
                  }}
                >
                  For `.xlsx`, the first worksheet is used. No backend upload
                  happens yet; this page is for preview and mapping only.
                </Typography>
              </Box>
              <input
                ref={fileInputRef}
                hidden
                type='file'
                accept={
                  fileType === 'csv'
                    ? '.csv,text/csv'
                    : '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
                onChange={handleFileSelected}
              />
              <Button
                variant='contained'
                startIcon={<UploadFileOutlinedIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={loadingReferences || parsing}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                {parsing
                  ? 'Parsing file...'
                  : `Select ${fileType.toUpperCase()} file`}
              </Button>
              {uploadedFileName ? (
                <Typography sx={{ fontSize: 13, color: '#334155' }}>
                  Loaded file:{' '}
                  <Box component='span' sx={{ fontWeight: 700 }}>
                    {uploadedFileName}
                  </Box>
                </Typography>
              ) : null}
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingRow)}
        onClose={() => setEditingRow(null)}
        fullWidth
        maxWidth='md'
        slotProps={{
          paper: {
            sx: {
              borderRadius: '24px',
              border: '1px solid #dbe4ee',
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1.25 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
            Edit Imported Row
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: 14, color: '#64748b' }}>
            Update the preview data before import. Changes apply only to the frontend preview rows.
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 2 }}>
          {editingRow ? (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label='Name'
                  size='small'
                  fullWidth
                  value={editingRow.name}
                  onChange={(event) => updateEditingRow('name', event.target.value)}
                />
                <TextField
                  label='SKU'
                  size='small'
                  fullWidth
                  value={editingRow.sku}
                  onChange={(event) => updateEditingRow('sku', event.target.value)}
                />
                <TextField
                  label='Barcode'
                  size='small'
                  fullWidth
                  value={editingRow.barcode}
                  onChange={(event) => updateEditingRow('barcode', event.target.value)}
                />
              </Stack>

              <TextField
                label='Description'
                size='small'
                fullWidth
                multiline
                minRows={3}
                value={editingRow.description}
                onChange={(event) => updateEditingRow('description', event.target.value)}
              />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  select
                  label='Category'
                  size='small'
                  fullWidth
                  value={editingRow.categoryId}
                  onChange={(event) => updateEditingRow('categoryId', event.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label='Brand'
                  size='small'
                  fullWidth
                  value={editingRow.brandId}
                  onChange={(event) => updateEditingRow('brandId', event.target.value)}
                >
                  <MenuItem value=''>No brand</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label='Unit'
                  size='small'
                  fullWidth
                  value={editingRow.unitOfMeasureId}
                  onChange={(event) => updateEditingRow('unitOfMeasureId', event.target.value)}
                >
                  {units.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label='Cost Price'
                  type='number'
                  size='small'
                  fullWidth
                  value={editingRow.costPrice}
                  onChange={(event) => updateEditingRow('costPrice', Number(event.target.value))}
                />
                <TextField
                  label='Selling Price'
                  type='number'
                  size='small'
                  fullWidth
                  value={editingRow.sellingPrice}
                  onChange={(event) => updateEditingRow('sellingPrice', Number(event.target.value))}
                />
                <TextField
                  label='Tax Rate'
                  type='number'
                  size='small'
                  fullWidth
                  value={editingRow.taxRate}
                  onChange={(event) => updateEditingRow('taxRate', Number(event.target.value))}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label='Reorder Level'
                  type='number'
                  size='small'
                  fullWidth
                  value={editingRow.reorderLevel}
                  onChange={(event) => updateEditingRow('reorderLevel', Number(event.target.value))}
                />
                <TextField
                  label='Reorder Quantity'
                  type='number'
                  size='small'
                  fullWidth
                  value={editingRow.reorderQuantity}
                  onChange={(event) => updateEditingRow('reorderQuantity', Number(event.target.value))}
                />
                <TextField
                  select
                  label='Status'
                  size='small'
                  fullWidth
                  value={editingRow.status}
                  onChange={(event) => updateEditingRow('status', Number(event.target.value) as ProductStatus)}
                >
                  <MenuItem value={ProductStatus.Draft}>Draft</MenuItem>
                  <MenuItem value={ProductStatus.Active}>Active</MenuItem>
                  <MenuItem value={ProductStatus.Inactive}>Inactive</MenuItem>
                  <MenuItem value={ProductStatus.Discontinued}>Discontinued</MenuItem>
                </TextField>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label='Weight'
                  type='number'
                  size='small'
                  fullWidth
                  value={editingRow.weight}
                  onChange={(event) => updateEditingRow('weight', Number(event.target.value))}
                />
                <TextField
                  label='Length'
                  type='number'
                  size='small'
                  fullWidth
                  value={editingRow.length}
                  onChange={(event) => updateEditingRow('length', Number(event.target.value))}
                />
                <TextField
                  label='Width'
                  type='number'
                  size='small'
                  fullWidth
                  value={editingRow.width}
                  onChange={(event) => updateEditingRow('width', Number(event.target.value))}
                />
                <TextField
                  label='Height'
                  type='number'
                  size='small'
                  fullWidth
                  value={editingRow.height}
                  onChange={(event) => updateEditingRow('height', Number(event.target.value))}
                />
              </Stack>

              <TextField
                label='Thumbnail URL'
                size='small'
                fullWidth
                value={editingRow.thumbnailImageUrl}
                onChange={(event) => updateEditingRow('thumbnailImageUrl', event.target.value)}
              />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} flexWrap='wrap' useFlexGap>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingRow.trackInventory}
                      onChange={(event) => updateEditingRow('trackInventory', event.target.checked)}
                    />
                  }
                  label='Track inventory'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingRow.allowBackOrder}
                      onChange={(event) => updateEditingRow('allowBackOrder', event.target.checked)}
                    />
                  }
                  label='Allow backorder'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingRow.isSerialized}
                      onChange={(event) => updateEditingRow('isSerialized', event.target.checked)}
                    />
                  }
                  label='Serialized'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingRow.isBatchTracked}
                      onChange={(event) => updateEditingRow('isBatchTracked', event.target.checked)}
                    />
                  }
                  label='Batch tracked'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingRow.isPerishable}
                      onChange={(event) => updateEditingRow('isPerishable', event.target.checked)}
                    />
                  }
                  label='Perishable'
                />
              </Stack>

              {editingRow.validationIssues.length > 0 ? (
                <Alert severity='warning'>
                  {editingRow.validationIssues.join('. ')}
                </Alert>
              ) : null}
              {getChangedFields(editingRow, editingRow.originalValues).length > 0 ? (
                <Alert severity='info'>
                  Updated fields:{' '}
                  {getChangedFields(editingRow, editingRow.originalValues)
                    .map((field) => productImportFieldLabels[field])
                    .join(', ')}
                </Alert>
              ) : null}
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant='outlined' onClick={() => setEditingRow(null)}>
            Cancel
          </Button>
          <Button variant='contained' onClick={saveEditingRow}>
            Save Row
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
