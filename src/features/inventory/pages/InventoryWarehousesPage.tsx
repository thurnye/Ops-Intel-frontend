import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import type { Warehouse } from "@features/inventory/types/inventory.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function InventoryWarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void inventoryApi.listWarehouses()
      .then((response) => setWarehouses(getApiData(response, [])))
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load warehouses.")));
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Warehouse>[]>(() => [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Warehouse" },
    { accessorKey: "city", header: "City", cell: ({ row }) => row.original.city ?? "—" },
    { accessorKey: "country", header: "Country", cell: ({ row }) => row.original.country ?? "—" },
    {
      accessorKey: "isActive",
      header: "State",
      cell: ({ row }) => (
        <Chip
          label={row.original.isActive ? "Active" : "Inactive"}
          size="small"
          sx={{ bgcolor: row.original.isActive ? "#dcfce7" : "#e2e8f0", color: row.original.isActive ? "#166534" : "#475569", fontWeight: 700 }}
        />
      )
    }
  ], []);

  const active = warehouses.filter((warehouse) => warehouse.isActive).length;

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Warehouses</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Monitor the location footprint that supports inventory, production, and shipping.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Total Warehouses</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800 }}>{warehouses.length}</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Active</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#16a34a" }}>{active}</Typography></CardContent></Card>
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={warehouses} emptyState="No warehouses found." /></CardContent></Card>
    </Container>
  );
}
