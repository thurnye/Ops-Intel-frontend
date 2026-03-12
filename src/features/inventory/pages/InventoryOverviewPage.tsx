import {
  Box,
  Card,
  Chip,
  Container,
  Button,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { useInventory } from "@features/inventory/hooks/useInventory";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import { ProductStatus, type ProductListItem } from "@features/inventory/types/inventory.types";
import { setInventoryPage, setInventoryPageSize, setProductFilters } from "@features/inventory/redux/slices/inventory.slice";
import { fetchInventoryOverviewData, fetchInventoryReferenceData } from "@features/inventory/redux/inventory.thunks";
import { InventorySummaryCards } from "@features/inventory/components/InventorySummaryCard";
import { formatCurrency, productStatusColor, productStatusLabel } from "@features/inventory/utils/inventory.utils";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function InventoryOverviewPage() {
  const dispatch = useAppDispatch();
  const { products, filters, page, pageSize, pagination, loading, categories, warehouses } = useInventory();
  const [summary, setSummary] = useState({
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    inactiveProducts: 0,
    discontinuedProducts: 0
  });
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchInventoryOverviewData({ page, pageSize, filters }));
  }, [dispatch, filters, page, pageSize]);

  useEffect(() => {
    void inventoryApi.getProductsSummary({
      searchTerm: filters.query || undefined,
      status: filters.status === "all" ? undefined : filters.status,
      categoryId: filters.categoryId === "all" ? undefined : filters.categoryId
    })
      .then((response) => {
        setSummary(getApiData(response, {
          totalProducts: 0,
          activeProducts: 0,
          draftProducts: 0,
          inactiveProducts: 0,
          discontinuedProducts: 0
        }));
        setSummaryError(null);
      })
      .catch((error) => setSummaryError(getErrorMessage(error, "Failed to load inventory summary.")));
  }, [filters.categoryId, filters.query, filters.status]);

  useEffect(() => {
    if (categories.length === 0 || warehouses.length === 0) {
      void dispatch(fetchInventoryReferenceData());
    }
  }, [categories.length, dispatch, warehouses.length]);

  const stats = [
    { label: "Catalog Total", value: summary.totalProducts, color: "#6366f1" },
    { label: "Active", value: summary.activeProducts, color: "#10b981" },
    { label: "Draft", value: summary.draftProducts, color: "#3b82f6" },
    { label: "Inactive / Discontinued", value: summary.inactiveProducts + summary.discontinuedProducts, color: "#f59e0b" }
  ];

  const columns = useMemo<AppDataTableColumnDef<ProductListItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <RouterLink className="font-medium text-indigo-600 no-underline hover:text-indigo-800" to={`/inventory/${row.original.id}`}>
            {row.original.name}
          </RouterLink>
        )
      },
      {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: 12.5, fontFamily: "monospace", color: "#475569" }}>
            {row.original.sku}
          </Typography>
        )
      },
      {
        accessorKey: "categoryName",
        header: "Category"
      },
      {
        accessorKey: "brandName",
        header: "Brand",
        cell: ({ row }) => row.original.brandName ?? "—"
      },
      {
        accessorKey: "barcode",
        header: "Barcode",
        cell: ({ row }) => row.original.barcode ?? "—"
      },
      {
        accessorKey: "sellingPrice",
        header: "Price",
        meta: { align: "right" },
        cell: ({ row }) => formatCurrency(row.original.sellingPrice)
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { align: "center" },
        cell: ({ row }) => (
          <Chip
            label={productStatusLabel(row.original.status)}
            size="small"
            sx={{
              fontSize: 11,
              fontWeight: 700,
              bgcolor: `${productStatusColor(row.original.status)}18`,
              color: productStatusColor(row.original.status)
            }}
          />
        )
      }
    ],
    []
  );

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
        <Box>
          <Typography variant="h4">Inventory</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
            Products, stock levels and movements
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button component={RouterLink} to="/inventory/new" variant="contained" startIcon={<AddIcon />}>
            Create Product
          </Button>
          <RouterLink
            className="inline-flex items-center gap-1 self-center text-sm font-medium text-indigo-600 no-underline transition-colors hover:text-indigo-800"
            to="/inventory/movements"
          >
            View stock movements &rarr;
          </RouterLink>
        </Stack>
      </Stack>

      <InventorySummaryCards stats={stats} />
      {summaryError ? (
        <Typography sx={{ fontSize: 13, color: "#b91c1c" }}>
          {summaryError}
        </Typography>
      ) : null}

      <Card>
        {loading && <LinearProgress />}
        <Box className="p-4 pb-0">
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              placeholder="Search by name, SKU or barcode..."
              size="small"
              value={filters.query}
              onChange={(e) => {
                dispatch(setInventoryPage(1));
                dispatch(setProductFilters({ query: e.target.value }));
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                    </InputAdornment>
                  )
                }
              }}
            />
            <Select
              size="small"
              value={String(filters.status)}
              onChange={(e: SelectChangeEvent<string>) => {
                dispatch(setInventoryPage(1));
                dispatch(setProductFilters({ status: e.target.value === "all" ? "all" : Number(e.target.value) as ProductStatus }));
              }}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value={ProductStatus.Draft}>Draft</MenuItem>
              <MenuItem value={ProductStatus.Active}>Active</MenuItem>
              <MenuItem value={ProductStatus.Inactive}>Inactive</MenuItem>
              <MenuItem value={ProductStatus.Discontinued}>Discontinued</MenuItem>
            </Select>
            <Select
              size="small"
              value={filters.categoryId}
              onChange={(e) => {
                dispatch(setInventoryPage(1));
                dispatch(setProductFilters({ categoryId: e.target.value }));
              }}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </Stack>
        </Box>
        <Box sx={{ p: 2 }}>
          <AppDataTable
            columns={columns}
            data={products}
            emptyState="No products match your search."
            manualPagination
            pageIndex={page - 1}
            pageSize={pageSize}
            totalRows={pagination?.total ?? 0}
            onPageChange={(pageIndex) => dispatch(setInventoryPage(pageIndex + 1))}
            onPageSizeChange={(nextPageSize) => {
              dispatch(setInventoryPageSize(nextPageSize));
              dispatch(setInventoryPage(1));
            }}
          />
        </Box>
      </Card>
    </Container>
  );
}
