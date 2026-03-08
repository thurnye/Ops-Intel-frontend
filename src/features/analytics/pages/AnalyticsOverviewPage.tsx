import { Box, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { MetricCard } from "@features/analytics/components/MetricCard";
import { TrendChart } from "@features/analytics/components/TrendChart";
import { useAnalytics } from "@features/analytics/hooks/useAnalytics";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { setAnalyticsFilters } from "@features/analytics/redux/slices/analytics.slice";
import type { AnalyticsCategory } from "@features/analytics/types/analytics.types";

const CATEGORIES: { value: AnalyticsCategory | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "production", label: "Production" },
  { value: "fulfillment", label: "Fulfillment" },
  { value: "inventory", label: "Inventory" }
];

export function AnalyticsOverviewPage() {
  const dispatch = useAppDispatch();
  const { filteredDatasets, filters } = useAnalytics();

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Analytics</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Deeper KPI and trend exploration across operations</Typography>
      </Box>
      <Stack direction="row" spacing={1} className="rounded-xl border border-slate-200 bg-white p-1" sx={{ width: "fit-content" }}>
        {CATEGORIES.map((c) => (
          <Chip key={c.value} label={c.label} size="small"
            onClick={() => dispatch(setAnalyticsFilters({ ...filters, category: c.value }))}
            sx={filters.category === c.value ? { bgcolor: "#0f172a", color: "#fff" } : {}}
            variant={filters.category === c.value ? "filled" : "outlined"} />
        ))}
      </Stack>
      {filteredDatasets.map((dataset) => (
        <Box key={dataset.id} className="space-y-3">
          <Typography variant="h6">{dataset.label}</Typography>
          <Grid container spacing={2}>
            {dataset.metrics.map((metric) => (
              <Grid key={metric.id} size={{ xs: 6, md: 3 }}><MetricCard metric={metric} /></Grid>
            ))}
          </Grid>
          <TrendChart title={`${dataset.label} — Trend`} data={dataset.trend} />
        </Box>
      ))}
    </Container>
  );
}
