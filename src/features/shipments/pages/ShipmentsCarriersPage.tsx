import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { shipmentsApi } from "@features/shipments/services/shipments.api.service";
import type { Carrier } from "@features/shipments/types/shipments.types";
import { getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";

export function ShipmentsCarriersPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void shipmentsApi.listCarriers({ pageNumber: 1, pageSize: 100 })
      .then((response) => setCarriers(getPagedItems(response)))
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load carriers.")));
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Carrier>[]>(() => [
    { accessorKey: "carrierCode", header: "Code" },
    { accessorKey: "name", header: "Carrier" },
    { accessorKey: "contactName", header: "Contact", cell: ({ row }) => row.original.contactName ?? "—" },
    { accessorKey: "email", header: "Email", cell: ({ row }) => row.original.email ?? "—" },
    {
      id: "services",
      header: "Services",
      meta: { align: "center" },
      cell: ({ row }) => row.original.services.length
    },
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

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Carriers</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Review the carrier network and the service portfolio backing shipment execution.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Carriers</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800 }}>{carriers.length}</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Services</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#6366f1" }}>{carriers.reduce((sum, carrier) => sum + carrier.services.length, 0)}</Typography></CardContent></Card>
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={carriers} emptyState="No carriers found." /></CardContent></Card>
    </Container>
  );
}
