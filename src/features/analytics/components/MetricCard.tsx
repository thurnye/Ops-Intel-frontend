import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import type { AnalyticsMetric } from "@features/analytics/types/analytics.types";
import { metricChangePercent, trendColor } from "@features/analytics/utils/analytics.utils";

type Props = { metric: AnalyticsMetric };

const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") return <TrendingUpIcon sx={{ fontSize: 16 }} />;
  if (trend === "down") return <TrendingDownIcon sx={{ fontSize: 16 }} />;
  return <TrendingFlatIcon sx={{ fontSize: 16 }} />;
};

export function MetricCard({ metric }: Props) {
  return (
    <Card>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={1.5}>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>{metric.label}</Typography>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>{metric.current}</Typography>
            <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>{metric.unit}</Typography>
          </Stack>
          <Chip icon={<TrendIcon trend={metric.trend} />} label={metricChangePercent(metric)} color={trendColor(metric.trend)}
            size="small" variant="outlined" sx={{ height: 24, width: "fit-content", fontSize: 11 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}
