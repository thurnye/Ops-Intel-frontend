import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { schedulingApi } from "@features/scheduling/services/scheduling.api.service";
import type { Shift } from "@features/scheduling/types/scheduling.types";
import { getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";

export function SchedulingShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void schedulingApi.listShifts({ pageNumber: 1, pageSize: 100 })
      .then((response) => setShifts(getPagedItems(response)))
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load shifts.")));
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Shift>[]>(() => [
    { accessorKey: "shiftCode", header: "Shift" },
    { accessorKey: "shiftName", header: "Name" },
    { accessorKey: "warehouseName", header: "Warehouse", cell: ({ row }) => row.original.warehouseName ?? "—" },
    { accessorKey: "workCenterName", header: "Work Center", cell: ({ row }) => row.original.workCenterName ?? "—" },
    { accessorKey: "startTime", header: "Start" },
    { accessorKey: "endTime", header: "End" },
    {
      accessorKey: "isActive",
      header: "State",
      cell: ({ row }) => <Chip label={row.original.isActive ? "Active" : "Inactive"} size="small" sx={{ bgcolor: row.original.isActive ? "#dbeafe" : "#e2e8f0", color: row.original.isActive ? "#1d4ed8" : "#475569", fontWeight: 700 }} />
    }
  ], []);

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Shifts</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Review the active operating shifts that anchor schedule and dispatch timing.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Shifts</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800 }}>{shifts.length}</Typography></CardContent></Card>
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={shifts} emptyState="No shifts found." /></CardContent></Card>
    </Container>
  );
}
