import { alpha, Avatar, Box, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import type { AnalyticsMetricProgress } from "@features/analytics/types/analytics.types";
import { renderDashboardIcon } from "@features/dashboard/utils/dashboard.icons";

type AnalyticsMetricRowProps = {
  metric: AnalyticsMetricProgress;
};

export function AnalyticsMetricRow({ metric }: AnalyticsMetricRowProps) {
  const theme = useTheme();

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.9 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
            }}
          >
            {renderDashboardIcon(metric.iconKey, { sx: { fontSize: 18 } })}
          </Avatar>
          <Typography variant="body2">{metric.label}</Typography>
        </Stack>

        <Typography variant="body2" fontWeight={700}>
          {metric.value}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={metric.progress}
        sx={{
          height: 8,
          borderRadius: 999,
          bgcolor: alpha(theme.palette.divider, 0.55),
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
          },
        }}
      />
    </Box>
  );
}
