import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import type { Brand } from "@features/inventory/types/inventory.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function InventoryBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void inventoryApi.listBrands()
      .then((response) => setBrands(getApiData(response, [])))
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load brands.")));
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Brand>[]>(() => [
    { accessorKey: "name", header: "Brand" },
    { accessorKey: "description", header: "Description", cell: ({ row }) => row.original.description ?? "—" }
  ], []);

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Inventory Brands</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Maintain the commercial brand registry used across product catalogs.
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Brands</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a" }}>{brands.length}</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>With Notes</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#6366f1" }}>{brands.filter((brand) => brand.description).length}</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable columns={columns} data={brands} emptyState="No brands found." />
        </CardContent>
      </Card>
    </Container>
  );
}
