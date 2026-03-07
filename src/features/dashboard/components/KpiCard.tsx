import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { KpiCardData } from "@features/dashboard/types/dashboard.types";
import { kpiDeltaColor } from "@features/dashboard/utils/dashboard.utils";

type Props = {
  kpi: KpiCardData;
};

const tones: Record<string, { gradient: string; icon: string; border: string; bg: string }> = {
  k1: { gradient: "linear-gradient(135deg, #6366f1, #818cf8)", icon: "#6366f1", border: "#e0e7ff", bg: "#eef2ff" },
  k2: { gradient: "linear-gradient(135deg, #10b981, #34d399)", icon: "#10b981", border: "#d1fae5", bg: "#ecfdf5" },
  k3: { gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", icon: "#f59e0b", border: "#fef3c7", bg: "#fffbeb" },
  k4: { gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)", icon: "#8b5cf6", border: "#ede9fe", bg: "#f5f3ff" }
};

export function KpiCard({ kpi }: Props) {
  const tone = tones[kpi.id] ?? tones.k4;

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Box
        className="absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity group-hover:opacity-100"
        sx={{ background: tone.gradient }}
      />
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Box
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
              sx={{ backgroundColor: tone.bg, color: tone.icon, border: `1px solid ${tone.border}` }}
            >
              {kpi.value[0]}
            </Box>
            <Chip
              color={kpiDeltaColor(kpi)}
              label={kpi.delta}
              size="small"
              variant="outlined"
              sx={{ height: 24, fontSize: 12 }}
            />
          </Stack>

          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#64748b", mb: 0.5 }}>
              {kpi.label}
            </Typography>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              {kpi.value}
            </Typography>
          </Box>

          <Box className="h-1.5 w-full overflow-hidden rounded-full" sx={{ backgroundColor: tone.bg }}>
            <Box
              className="h-full rounded-full transition-all duration-500"
              sx={{ width: "68%", background: tone.gradient }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
