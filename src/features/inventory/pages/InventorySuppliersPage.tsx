import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import type { Supplier } from "@features/inventory/types/inventory.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function InventorySuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void inventoryApi.listSuppliers()
      .then((response) => setSuppliers(getApiData(response, [])))
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load suppliers.")));
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Supplier>[]>(() => [
    { accessorKey: "name", header: "Supplier" },
    { accessorKey: "contactPerson", header: "Contact", cell: ({ row }) => row.original.contactPerson ?? "—" },
    { accessorKey: "email", header: "Email", cell: ({ row }) => row.original.email ?? "—" },
    { accessorKey: "country", header: "Country", cell: ({ row }) => row.original.country ?? "—" },
    {
      accessorKey: "isActive",
      header: "State",
      cell: ({ row }) => (
        <Chip
          label={row.original.isActive ? "Active" : "Inactive"}
          size="small"
          sx={{ bgcolor: row.original.isActive ? "#dbeafe" : "#e2e8f0", color: row.original.isActive ? "#1d4ed8" : "#475569", fontWeight: 700 }}
        />
      )
    }
  ], []);

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Suppliers</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Review the external supply network feeding your product and material base.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Suppliers</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800 }}>{suppliers.length}</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Active</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#2563eb" }}>{suppliers.filter((supplier) => supplier.isActive).length}</Typography></CardContent></Card>
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={suppliers} emptyState="No suppliers found." /></CardContent></Card>
    </Container>
  );
}
