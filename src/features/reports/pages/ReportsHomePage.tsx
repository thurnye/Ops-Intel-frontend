import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { ReportCard } from "@features/reports/components/ReportCard";
import { useReports } from "@features/reports/hooks/useReports";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { setReportsFilters } from "@features/reports/redux/slices/reports.slice";
import { REPORT_TYPES } from "@features/reports/constants/reports.constants";
import type { ReportType } from "@features/reports/types/reports.types";

export function ReportsHomePage() {
  const dispatch = useAppDispatch();
  const { filteredReports, filters } = useReports();

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Reports</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Structured operational reporting across all domains</Typography>
      </Box>
      <Stack direction="row" spacing={1} className="rounded-xl border border-slate-200 bg-white p-1" sx={{ width: "fit-content" }}>
        <Chip label="All" size="small" onClick={() => dispatch(setReportsFilters({ ...filters, type: "" }))}
          sx={!filters.type ? { bgcolor: "#0f172a", color: "#fff" } : {}} variant={!filters.type ? "filled" : "outlined"} />
        {REPORT_TYPES.map((t) => (
          <Chip key={t.value} label={t.label} size="small"
            onClick={() => dispatch(setReportsFilters({ ...filters, type: t.value as ReportType }))}
            sx={filters.type === t.value ? { bgcolor: "#0f172a", color: "#fff" } : {}}
            variant={filters.type === t.value ? "filled" : "outlined"} />
        ))}
      </Stack>
      <Stack spacing={3}>
        {filteredReports.map((report) => <ReportCard key={report.type} report={report} />)}
      </Stack>
    </Container>
  );
}
