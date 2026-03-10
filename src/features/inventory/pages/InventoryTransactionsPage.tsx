import {
  Box,
  Card,
  Container,
  InputAdornment,
  TextField,
  Typography,
  LinearProgress
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Chip } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { useStockMovements } from "@features/inventory/hooks/useInventory";
import { useAppDispatch } from "@app/hooks/app.hooks";
import type { StockMovement } from "@features/inventory/types/inventory.types";
import { fetchInventoryMovementsData } from "@features/inventory/redux/inventory.thunks";
import { setMovementFilters } from "@features/inventory/redux/slices/inventory.slice";
import { movementTypeLabel, movementTypeColor } from "@features/inventory/utils/inventory.utils";

export function InventoryTransactionsPage() {
  const dispatch = useAppDispatch();
  const { movements, filters } = useStockMovements();

  useEffect(() => {
    if (movements.length === 0) {
      void dispatch(fetchInventoryMovementsData());
    }
  }, [dispatch, movements.length]);

  const columns = useMemo<AppDataTableColumnDef<StockMovement>[]>(
    () => [
      {
        accessorKey: "movementDateUtc",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.movementDateUtc).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          })
      },
      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => (
          <RouterLink className="text-sm font-medium text-indigo-600 no-underline hover:text-indigo-800" to={`/inventory/${row.original.productId}`}>
            {row.original.productName}
          </RouterLink>
        )
      },
      { accessorKey: "warehouseName", header: "Warehouse" },
      {
        accessorKey: "movementType",
        header: "Type",
        cell: ({ row }) => (
          <Chip
            label={movementTypeLabel(row.original.movementType)}
            size="small"
            sx={{
              fontSize: 11,
              fontWeight: 700,
              bgcolor: `${movementTypeColor(row.original.movementType)}18`,
              color: movementTypeColor(row.original.movementType)
            }}
          />
        )
      },
      { accessorKey: "quantity", header: "Qty", meta: { align: "right" } },
      { accessorKey: "quantityBefore", header: "Before", meta: { align: "right" } },
      { accessorKey: "quantityAfter", header: "After", meta: { align: "right" } },
      {
        accessorKey: "referenceNumber",
        header: "Reference",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>
            {row.original.referenceNumber ?? "—"}
          </Typography>
        )
      }
    ],
    []
  );

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Box>
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to="/inventory">
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back to Inventory
        </RouterLink>
        <Typography variant="h4" mt={1}>Stock Movements</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Track all stock-in, stock-out and adjustment history</Typography>
      </Box>

      <Card>
        {movements.length === 0 && <LinearProgress />}
        <Box className="p-4 pb-0">
          <TextField
            fullWidth
            placeholder="Search by product or reference number..."
            size="small"
            value={filters.query}
            onChange={(e) => dispatch(setMovementFilters({ query: e.target.value }))}
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
        </Box>
        <Box sx={{ p: 2 }}>
          <AppDataTable columns={columns} data={movements} emptyState="No movements match your search." initialPageSize={10} />
        </Box>
      </Card>
    </Container>
  );
}
