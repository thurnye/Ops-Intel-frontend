import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { productionApi } from "@features/production/services/production.api.service";
import type { Machine } from "@features/production/types/production.types";
import { machineStatusColor, machineStatusLabel } from "@features/production/utils/production.utils";
import { getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";

export function ProductionMachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void productionApi.listMachines({ pageNumber: 1, pageSize: 100 })
      .then((response) => setMachines(getPagedItems(response)))
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load machines.")));
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Machine>[]>(() => [
    { accessorKey: "machineCode", header: "Machine" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "workCenterName", header: "Work Center", cell: ({ row }) => row.original.workCenterName ?? "—" },
    { accessorKey: "manufacturer", header: "Manufacturer", cell: ({ row }) => row.original.manufacturer ?? "—" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Chip label={machineStatusLabel(row.original.status)} size="small" sx={{ bgcolor: `${machineStatusColor(row.original.status)}18`, color: machineStatusColor(row.original.status), fontWeight: 700 }} />
    }
  ], []);

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Machines</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Keep the machine estate visible across status, work-center alignment, and maintenance posture.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Machines</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800 }}>{machines.length}</Typography></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Running</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#16a34a" }}>{machines.filter((machine) => machine.status === 2).length}</Typography></CardContent></Card>
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={machines} emptyState="No machines found." /></CardContent></Card>
    </Container>
  );
}
