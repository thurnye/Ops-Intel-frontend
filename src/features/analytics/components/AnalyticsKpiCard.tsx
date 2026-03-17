import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { alpha, Avatar, Card, CardContent, Chip, Stack, Typography, useTheme } from "@mui/material";
import type { AnalyticsKpi } from "@features/analytics/types/analytics.types";
import { renderDashboardIcon } from "@features/dashboard/utils/dashboard.icons";

type AnalyticsKpiCardProps = {
  kpi: AnalyticsKpi;
};

export function AnalyticsKpiCard({ kpi }: AnalyticsKpiCardProps) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 1,
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack>
            <Typography variant="body2" color="text.secondary">
              {kpi.title}
            </Typography>

            <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
              {kpi.value}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.25 }}>
              <Chip
                size="small"
                icon={kpi.positive ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
                label={kpi.change}
                sx={{
                  fontWeight: 700,
                  bgcolor: kpi.positive
                    ? alpha(theme.palette.success.main, 0.12)
                    : alpha(theme.palette.error.main, 0.12),
                  color: kpi.positive ? "success.main" : "error.main",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {kpi.helper}
              </Typography>
            </Stack>
          </Stack>

          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
            }}
          >
            {renderDashboardIcon(kpi.iconKey)}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
