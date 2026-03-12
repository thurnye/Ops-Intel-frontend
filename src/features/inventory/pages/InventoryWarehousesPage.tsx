import { useEffect, useMemo, useState } from "react";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { MetricCard } from "@app/components/MetricCard";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import type { Warehouse, WarehouseMetricsSummary } from "@features/inventory/types/inventory.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function InventoryWarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [summary, setSummary] = useState<WarehouseMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([inventoryApi.listWarehouses(), inventoryApi.getWarehousesSummary()])
      .then(([warehousesResponse, summaryResponse]) => {
        setWarehouses(getApiData(warehousesResponse, []));
        setSummary(getApiData(summaryResponse, null));
      })
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

  const active = summary?.activeWarehouses ?? warehouses.filter((warehouse) => warehouse.isActive).length;
  const countries = summary?.countriesRepresented ?? new Set(warehouses.map((warehouse) => warehouse.country).filter(Boolean)).size;
  const addressReady = summary?.addressReadyWarehouses ?? warehouses.filter((warehouse) => warehouse.addressLine1 && warehouse.city && warehouse.country).length;

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Card sx={{ border: "1px solid rgba(148, 163, 184, 0.18)", background: "linear-gradient(135deg, rgba(12,74,110,0.96) 0%, rgba(15,23,42,0.96) 58%, rgba(14,116,144,0.82) 100%)", color: "white" }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(186,230,253,0.92)" }}>
                Network Footprint
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.8, fontWeight: 800 }}>
                Warehouses
              </Typography>
              <Typography sx={{ fontSize: 14, maxWidth: 760, color: "rgba(226,232,240,0.92)", mt: 1 }}>
                Monitor the location footprint that supports inventory, production, and shipping. The operational quality here depends on active-site coverage and address completeness across the network.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`${countries} countries represented`} sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", fontWeight: 700 }} />
              <Chip label={`${addressReady} address-ready sites`} sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
              <Chip label="Supports stock and fulfillment" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Total Warehouses" value={summary?.totalWarehouses ?? warehouses.length} icon={<WarehouseOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Registered network sites available to planning and fulfillment." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Active" value={active} tone="#16a34a" icon={<TaskAltOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Sites currently available for operational use." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Countries" value={countries} tone="#0284c7" icon={<PublicOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Geographic spread of the warehouse network." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Address Ready" value={addressReady} tone="#7c3aed" icon={<TaskAltOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Sites with complete location details for downstream logistics flows." />
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={warehouses} emptyState="No warehouses found." /></CardContent></Card>
    </Container>
  );
}
