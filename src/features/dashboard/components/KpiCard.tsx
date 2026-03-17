import { alpha, Avatar, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { DashboardKpiCard } from "@features/dashboard/types/dashboard.types";
import { renderDashboardIcon } from "@features/dashboard/utils/dashboard.icons";
import { getKpiTrendChipColor } from "@features/dashboard/utils/dashboard.utils";

type KpiCardProps = {
  kpi: DashboardKpiCard;
};

export function KpiCard({ kpi }: KpiCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        background: `linear-gradient(180deg, ${alpha(kpi.color, 0.08)} 0%, rgba(255,255,255,1) 42%)`,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                {kpi.title}
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                {kpi.value}
              </Typography>
            </Stack>
            <Avatar
              variant="rounded"
              sx={{
                width: 52,
                height: 52,
                borderRadius: 1,
                bgcolor: alpha(kpi.color, 0.14),
                color: kpi.color,
              }}
            >
              {renderDashboardIcon(kpi.iconKey)}
            </Avatar>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              icon={renderDashboardIcon("trend", { sx: { fontSize: 16 } })}
              label={kpi.change}
              size="small"
              color={getKpiTrendChipColor(kpi)}
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              {kpi.subtext}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
