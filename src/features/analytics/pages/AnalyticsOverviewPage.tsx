import { alpha, Avatar, Box, Button, Chip, Grid, MenuItem, Paper, Select, Stack, Typography, useTheme } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { AppBarChart, AppLineChart, AppPieChart } from "@app/components/charts";
import { AnalyticsKpiCard } from "@features/analytics/components/AnalyticsKpiCard";
import { AnalyticsMetricRow } from "@features/analytics/components/AnalyticsMetricRow";
import { AnalyticsPanel } from "@features/analytics/components/AnalyticsPanel";
import { AnalyticsSectionHeader } from "@features/analytics/components/AnalyticsSectionHeader";
import { useAnalytics } from "@features/analytics/hooks/useAnalytics";
import { getAnalyticsAlertTone } from "@features/analytics/types/analytics.types";
import { renderDashboardIcon } from "@features/dashboard/utils/dashboard.icons";

export function AnalyticsOverviewPage() {
  const theme = useTheme();
  const { overview, filters, onFiltersChange } = useAnalytics();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
        bgcolor: alpha(theme.palette.primary.main, 0.015),
      }}
    >
      <AnalyticsSectionHeader
        title={overview.header.title}
        subtitle={overview.header.subtitle}
        action={
          <Stack direction="row" spacing={1}>
            <Select
              size="small"
              value={filters.dateRange}
              onChange={(event) =>
                onFiltersChange({ ...filters, dateRange: event.target.value as typeof filters.dateRange })
              }
              sx={{ minWidth: 110 }}
            >
              {overview.header.dateRangeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              value={filters.plant}
              onChange={(event) => onFiltersChange({ ...filters, plant: event.target.value })}
              sx={{ minWidth: 150 }}
            >
              {overview.header.plantOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              {overview.header.exportLabel}
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={2.5}>
        {overview.kpis.map((kpi) => (
          <Grid key={kpi.id} size={{ xs: 12, sm: 6, xl: 3 }}>
            <AnalyticsKpiCard kpi={kpi} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, lg: 8 }}>
          <AnalyticsPanel
            title={overview.operationalTrend.title}
            subtitle={overview.operationalTrend.subtitle}
          >
            <Box sx={{ height: 360 }}>
              <AppLineChart
                height={360}
                labels={overview.operationalTrend.chart.labels}
                series={overview.operationalTrend.chart.series.map((series) => ({
                  data: series.data,
                  label: series.label,
                  curve: "linear",
                }))}
              />
            </Box>
          </AnalyticsPanel>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <AnalyticsPanel
            title={overview.fulfillmentMix.title}
            subtitle={overview.fulfillmentMix.subtitle}
          >
            <Stack alignItems="center" justifyContent="center" sx={{ pt: 1 }}>
              <AppPieChart
                height={260}
                data={overview.fulfillmentMix.data}
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                cornerRadius={6}
              />
            </Stack>
          </AnalyticsPanel>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <AnalyticsPanel
            title={overview.throughput.title}
            subtitle={overview.throughput.subtitle}
          >
            <Box sx={{ height: 320 }}>
              <AppBarChart
                height={320}
                labels={overview.throughput.chart.labels}
                series={overview.throughput.chart.series}
              />
            </Box>
          </AnalyticsPanel>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <AnalyticsPanel
            title={overview.shipmentPerformance.title}
            subtitle={overview.shipmentPerformance.subtitle}
          >
            <Box sx={{ height: 320 }}>
              <AppBarChart
                height={320}
                labels={overview.shipmentPerformance.chart.labels}
                series={overview.shipmentPerformance.chart.series}
              />
            </Box>
          </AnalyticsPanel>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <AnalyticsPanel title={overview.qualityTrend.title} subtitle={overview.qualityTrend.subtitle}>
            <Box sx={{ height: 300 }}>
              <AppLineChart
                height={300}
                labels={overview.qualityTrend.chart.labels}
                series={overview.qualityTrend.chart.series.map((series) => ({
                  data: series.data,
                  label: series.label,
                  curve: "linear",
                }))}
              />
            </Box>
          </AnalyticsPanel>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <AnalyticsPanel
            title={overview.operationalHealth.title}
            subtitle={overview.operationalHealth.subtitle}
          >
            <Stack spacing={2}>
              {overview.operationalHealth.metrics.map((metric) => (
                <AnalyticsMetricRow key={metric.id} metric={metric} />
              ))}
            </Stack>
          </AnalyticsPanel>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <AnalyticsPanel title={overview.alerts.title} subtitle={overview.alerts.subtitle}>
            <Stack spacing={1.5}>
              {overview.alerts.items.map((item) => {
                const severityTone = getAnalyticsAlertTone(item.severity);
                const severityColor =
                  item.severity === "High"
                    ? theme.palette.error.main
                    : item.severity === "Medium"
                      ? theme.palette.warning.main
                      : theme.palette.success.main;

                return (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{
                      p: 1.75,
                      borderRadius: 1,
                      borderColor: alpha(severityColor, 0.35),
                      bgcolor: alpha(severityColor, 0.04),
                    }}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2.5,
                          bgcolor: alpha(severityColor, 0.14),
                          color: severityColor,
                        }}
                      >
                        <WarningAmberRoundedIcon fontSize="small" />
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                          <Typography variant="body1" fontWeight={700}>
                            {item.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={item.severity}
                            color={severityTone}
                            sx={{
                              fontWeight: 700,
                              bgcolor: alpha(severityColor, 0.12),
                              color: severityColor,
                            }}
                          />
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </AnalyticsPanel>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel
            title={overview.insightSummary.title}
            subtitle={overview.insightSummary.subtitle}
          >
            <Grid container spacing={2}>
              {overview.insightSummary.cards.map((item) => (
                <Grid key={item.id} size={{ xs: 12, md: 4 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      height: "100%",
                      p: 2,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.background.paper, 0.72),
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: "primary.main",
                        mb: 1.5,
                      }}
                    >
                      {renderDashboardIcon(item.iconKey)}
                    </Avatar>

                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                      {item.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {item.body}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Box>
  );
}
