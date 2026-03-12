import { useEffect, useMemo, useState } from "react";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { MetricCard } from "@app/components/MetricCard";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import type { Supplier, SupplierMetricsSummary } from "@features/inventory/types/inventory.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function InventorySuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [summary, setSummary] = useState<SupplierMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([inventoryApi.listSuppliers(), inventoryApi.getSuppliersSummary()])
      .then(([suppliersResponse, summaryResponse]) => {
        setSuppliers(getApiData(suppliersResponse, []));
        setSummary(getApiData(summaryResponse, null));
      })
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

  const activeSuppliers = summary?.activeSuppliers ?? suppliers.filter((supplier) => supplier.isActive).length;
  const contactableSuppliers = summary?.contactableSuppliers ?? suppliers.filter((supplier) => supplier.email || supplier.phoneNumber).length;
  const representedCountries = summary?.countriesRepresented ?? new Set(suppliers.map((supplier) => supplier.country).filter(Boolean)).size;

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Card sx={{ border: "1px solid rgba(148, 163, 184, 0.18)", background: "linear-gradient(135deg, rgba(20,83,45,0.96) 0%, rgba(15,23,42,0.96) 56%, rgba(21,128,61,0.82) 100%)", color: "white" }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(220,252,231,0.92)" }}>
                Supply Network
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.8, fontWeight: 800 }}>
                Suppliers
              </Typography>
              <Typography sx={{ fontSize: 14, maxWidth: 760, color: "rgba(226,232,240,0.92)", mt: 1 }}>
                Review the external supply network feeding your product and material base. This view is most useful when supplier records are active, reachable, and geographically understood.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`${contactableSuppliers} contactable suppliers`} sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", fontWeight: 700 }} />
              <Chip label={`${representedCountries} countries represented`} sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
              <Chip label="Feeds purchasing and replenishment" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Suppliers" value={summary?.totalSuppliers ?? suppliers.length} icon={<BusinessOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Approved and draft supplier records in the network." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Active" value={activeSuppliers} tone="#2563eb" icon={<TaskAltOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Suppliers currently enabled for sourcing operations." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Contactable" value={contactableSuppliers} tone="#0f766e" icon={<CallOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Suppliers with phone or email information available." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Countries" value={representedCountries} tone="#7c3aed" icon={<PublicOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Geographic coverage available to procurement." />
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={suppliers} emptyState="No suppliers found." /></CardContent></Card>
    </Container>
  );
}
