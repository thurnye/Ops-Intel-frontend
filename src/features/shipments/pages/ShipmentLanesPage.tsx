import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { shipmentsApi } from "@features/shipments/services/shipments.api.service";
import type { ShipmentAddress } from "@features/shipments/types/shipments.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function ShipmentLanesPage() {
  const [lanes, setLanes] = useState<ShipmentAddress[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void shipmentsApi.searchAddresses({ take: 200 })
      .then((response) => setLanes(getApiData(response, [])))
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load lane registry.")));
  }, []);

  const columns = useMemo<AppDataTableColumnDef<ShipmentAddress>[]>(() => [
    { accessorKey: "contactName", header: "Contact" },
    { accessorKey: "companyName", header: "Company", cell: ({ row }) => row.original.companyName ?? "—" },
    { accessorKey: "addressType", header: "Type" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "addressLine1", header: "Address" }
  ], []);

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Lanes</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Use the shipment address registry as the operational lane catalog for origin and destination handling.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Registered Lanes</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800 }}>{lanes.length}</Typography></CardContent></Card>
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={lanes} emptyState="No lane addresses found." /></CardContent></Card>
    </Container>
  );
}
