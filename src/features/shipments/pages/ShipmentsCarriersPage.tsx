import { useEffect, useMemo, useState } from "react";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { MetricCard } from "@app/components/MetricCard";
import { shipmentsApi } from "@features/shipments/services/shipments.api.service";
import type { Carrier, CarrierMetricsSummary } from "@features/shipments/types/shipments.types";
import { getApiData, getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";

export function ShipmentsCarriersPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [summary, setSummary] = useState<CarrierMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      shipmentsApi.listCarriers({ pageNumber: 1, pageSize: 100 }),
      shipmentsApi.getCarriersSummary()
    ])
      .then(([carriersResponse, summaryResponse]) => {
        setCarriers(getPagedItems(carriersResponse));
        setSummary(getApiData(summaryResponse, null));
      })
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

  const activeCarriers = summary?.activeCarriers ?? carriers.filter((carrier) => carrier.isActive).length;
  const totalServices = summary?.totalServices ?? carriers.reduce((sum, carrier) => sum + carrier.services.length, 0);
  const contactable = summary?.contactableCarriers ?? carriers.filter((carrier) => carrier.email || carrier.phone).length;

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Card sx={{ border: "1px solid rgba(148, 163, 184, 0.18)", background: "linear-gradient(135deg, rgba(88,28,135,0.96) 0%, rgba(30,41,59,0.96) 54%, rgba(37,99,235,0.8) 100%)", color: "white" }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(233,213,255,0.92)" }}>
                Carrier Network
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.8, fontWeight: 800 }}>
                Carriers
              </Typography>
              <Typography sx={{ fontSize: 14, maxWidth: 760, color: "rgba(226,232,240,0.92)", mt: 1 }}>
                Review the carrier network and the service portfolio backing shipment execution. The stronger signal here is partner readiness, service density, and how reachable each carrier is when exceptions occur.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`${activeCarriers} active carriers`} sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", fontWeight: 700 }} />
              <Chip label={`${totalServices} service offerings`} sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
              <Chip label={`${contactable} contactable partners`} sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Carriers" value={summary?.totalCarriers ?? carriers.length} icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Total carrier records in the database." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Services" value={totalServices} tone="#6366f1" icon={<RouteOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Delivery services and modes exposed across the carrier roster." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Active" value={activeCarriers} tone="#16a34a" icon={<ChecklistRtlOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Partners currently enabled for operational use." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Contactable" value={contactable} tone="#0f766e" icon={<CallOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Carriers with phone or email context available for issue resolution." />
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={carriers} emptyState="No carriers found." /></CardContent></Card>
    </Container>
  );
}
