import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { productionApi } from "@features/production/services/production.api.service";
import type { RoutingSummary } from "@features/production/types/production.types";
import { getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";

export function ProductionRoutingsPage() {
  const [routings, setRoutings] = useState<RoutingSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void productionApi.listRoutings({ pageNumber: 1, pageSize: 100 })
      .then((response) => setRoutings(getPagedItems(response)))
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load routings.")));
  }, []);

  const columns = useMemo<AppDataTableColumnDef<RoutingSummary>[]>(() => [
    { accessorKey: "routingCode", header: "Routing" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "productName", header: "Product", cell: ({ row }) => row.original.productName ?? "—" },
    { accessorKey: "version", header: "Version", meta: { align: "center" } },
    {
      accessorKey: "isDefault",
      header: "Default",
      cell: ({ row }) => row.original.isDefault ? <Chip label="Default" size="small" sx={{ bgcolor: "#ede9fe", color: "#6d28d9", fontWeight: 700 }} /> : "—"
    },
    {
      accessorKey: "isActive",
      header: "State",
      cell: ({ row }) => <Chip label={row.original.isActive ? "Active" : "Inactive"} size="small" sx={{ bgcolor: row.original.isActive ? "#dcfce7" : "#e2e8f0", color: row.original.isActive ? "#166534" : "#475569", fontWeight: 700 }} />
    }
  ], []);

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Routings</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Track the production process blueprints that define work-center flow and sequencing.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Routings</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800 }}>{routings.length}</Typography></CardContent></Card>
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={routings} emptyState="No routings found." /></CardContent></Card>
    </Container>
  );
}
