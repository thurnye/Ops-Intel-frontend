import {
  Box, Button, Card, CardContent, Chip, Container, Grid, LinearProgress, Stack,
  TextField, InputAdornment, Typography, MenuItem, Select, type SelectChangeEvent
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { useProduction } from "@features/production/hooks/useProduction";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { productionApi } from "@features/production/services/production.api.service";
import { fetchProductionOrders } from "@features/production/redux/production.thunks";
import { setProductionFilters, setProductionPage, setProductionPageSize } from "@features/production/redux/slices/production.slice";
import { ProductionOrderStatus, ProductionPriority, type ProductionOrderSummary } from "@features/production/types/production.types";
import {
  orderStatusLabel, orderStatusColor, priorityLabel, priorityColor,
  progressPercent, formatDate
} from "@features/production/utils/production.utils";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function ProductionOverviewPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, filters, page, pageSize, pagination } = useProduction();
  const [summary, setSummary] = useState({
    totalOrders: 0,
    inProgressOrders: 0,
    pausedOrders: 0,
    completedOrders: 0,
    plannedOrDraftOrders: 0
  });
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchProductionOrders({ page, pageSize, filters }));
  }, [dispatch, filters, page, pageSize]);

  useEffect(() => {
    void productionApi.getOrdersSummary({
      searchTerm: filters.query || undefined,
      status: filters.status === "all" ? undefined : filters.status,
      priority: filters.priority === "all" ? undefined : filters.priority,
      plannedStartDateFrom: filters.plannedStartFrom || undefined,
      plannedStartDateTo: filters.plannedStartTo || undefined
    })
      .then((response) => {
        setSummary(getApiData(response, {
          totalOrders: 0,
          inProgressOrders: 0,
          pausedOrders: 0,
          completedOrders: 0,
          plannedOrDraftOrders: 0
        }));
        setSummaryError(null);
      })
      .catch((error) => setSummaryError(getErrorMessage(error, "Failed to load production summary.")));
  }, [filters.plannedStartFrom, filters.plannedStartTo, filters.priority, filters.query, filters.status]);

  const stats = [
    { label: "Total Orders", value: summary.totalOrders, color: "#6366f1" },
    { label: "In Progress", value: summary.inProgressOrders, color: "#f59e0b" },
    { label: "Paused", value: summary.pausedOrders, color: "#f97316" },
    { label: "Completed", value: summary.completedOrders, color: "#10b981" },
    { label: "Planned / Draft", value: summary.plannedOrDraftOrders, color: "#8b5cf6" }
  ];

  const columns = useMemo<AppDataTableColumnDef<ProductionOrderSummary>[]>(
    () => [
      {
        accessorKey: "productionOrderNumber",
        header: "Order #",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4338ca" }}>
            {row.original.productionOrderNumber}
          </Typography>
        )
      },
      { accessorKey: "productName", header: "Product" },
      {
        accessorKey: "productSku",
        header: "SKU",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>{row.original.productSku}</Typography>
        )
      },
      { accessorKey: "warehouseName", header: "Warehouse" },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <Chip
            label={priorityLabel(row.original.priority)}
            size="small"
            variant="outlined"
            sx={{ height: 22, fontSize: 11, borderColor: priorityColor(row.original.priority), color: priorityColor(row.original.priority) }}
          />
        )
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Chip
            label={orderStatusLabel(row.original.status)}
            size="small"
            sx={{ height: 22, fontSize: 11, bgcolor: orderStatusColor(row.original.status) + "18", color: orderStatusColor(row.original.status), fontWeight: 700 }}
          />
        )
      },
      {
        id: "progress",
        header: "Progress",
        meta: { width: 180 },
        cell: ({ row }) => {
          const pct = progressPercent(row.original);

          return (
            <Stack direction="row" alignItems="center" spacing={1}>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { borderRadius: 3 } }}
              />
              <Typography sx={{ fontSize: 12, fontWeight: 700, minWidth: 32, textAlign: "right" }}>{pct}%</Typography>
            </Stack>
          );
        }
      },
      {
        accessorKey: "plannedStartDate",
        header: "Planned Start",
        cell: ({ row }) => formatDate(row.original.plannedStartDate)
      },
      {
        accessorKey: "plannedEndDate",
        header: "Planned End",
        cell: ({ row }) => formatDate(row.original.plannedEndDate)
      }
    ],
    []
  );

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
        <Box>
          <Typography variant="h4">Production</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
            Monitor production orders, executions, and work center activity
          </Typography>
        </Box>
        <Button component={RouterLink} to="/production/new" variant="contained" startIcon={<AddIcon />}>
          Create Production Order
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 2.4 }}>
            <Card>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#64748b", mb: 0.5 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {summaryError ? (
        <Typography sx={{ fontSize: 13, color: "#b91c1c" }}>{summaryError}</Typography>
      ) : null}

      {/* Filters */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          size="small"
          placeholder="Search orders..."
          value={filters.query}
          onChange={(e) => {
            dispatch(setProductionPage(1));
            dispatch(setProductionFilters({ query: e.target.value }));
          }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment> } }}
          sx={{ minWidth: 260 }}
        />
        <Select
          native={false}
          size="small"
          value={String(filters.status)}
          onChange={(e: SelectChangeEvent<string>) => {
            dispatch(setProductionPage(1));
            dispatch(setProductionFilters({ status: e.target.value === "all" ? "all" : Number(e.target.value) as ProductionOrderStatus }));
          }}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value={ProductionOrderStatus.Draft}>Draft</MenuItem>
          <MenuItem value={ProductionOrderStatus.Planned}>Planned</MenuItem>
          <MenuItem value={ProductionOrderStatus.Released}>Released</MenuItem>
          <MenuItem value={ProductionOrderStatus.InProgress}>In Progress</MenuItem>
          <MenuItem value={ProductionOrderStatus.Paused}>Paused</MenuItem>
          <MenuItem value={ProductionOrderStatus.Completed}>Completed</MenuItem>
          <MenuItem value={ProductionOrderStatus.Closed}>Closed</MenuItem>
          <MenuItem value={ProductionOrderStatus.Cancelled}>Cancelled</MenuItem>
        </Select>
        <Select
          native={false}
          size="small"
          value={String(filters.priority)}
          onChange={(e: SelectChangeEvent<string>) => {
            dispatch(setProductionPage(1));
            dispatch(setProductionFilters({ priority: e.target.value === "all" ? "all" : Number(e.target.value) as ProductionPriority }));
          }}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">All Priorities</MenuItem>
          <MenuItem value={ProductionPriority.Low}>Low</MenuItem>
          <MenuItem value={ProductionPriority.Medium}>Medium</MenuItem>
          <MenuItem value={ProductionPriority.High}>High</MenuItem>
          <MenuItem value={ProductionPriority.Urgent}>Urgent</MenuItem>
        </Select>
        <TextField
          size="small"
          type="date"
          label="Start From"
          value={filters.plannedStartFrom}
          onChange={(e) => {
            dispatch(setProductionPage(1));
            dispatch(setProductionFilters({ plannedStartFrom: e.target.value }));
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          size="small"
          type="date"
          label="Start To"
          value={filters.plannedStartTo}
          onChange={(e) => {
            dispatch(setProductionPage(1));
            dispatch(setProductionFilters({ plannedStartTo: e.target.value }));
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>

      {/* Orders Table */}
      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable
            columns={columns}
            data={orders}
            emptyState="No production orders found."
            manualPagination
            pageIndex={page - 1}
            pageSize={pageSize}
            totalRows={pagination?.total ?? 0}
            onPageChange={(pageIndex) => dispatch(setProductionPage(pageIndex + 1))}
            onPageSizeChange={(nextPageSize) => {
              dispatch(setProductionPageSize(nextPageSize));
              dispatch(setProductionPage(1));
            }}
            onRowClick={(order) => navigate(order.id)}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
