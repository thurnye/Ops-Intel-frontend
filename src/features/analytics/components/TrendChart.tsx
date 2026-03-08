import { Box, Card, CardContent, Typography } from "@mui/material";
import type { TrendPoint } from "@features/analytics/types/analytics.types";

type Props = { title: string; data: TrendPoint[] };

export function TrendChart({ title, data }: Props) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>{title}</Typography>
        <Box className="flex items-end gap-1" sx={{ height: 120 }}>
          {data.map((point, i) => {
            const height = ((point.value - min) / range) * 100;
            return (
              <Box key={i} className="flex flex-1 flex-col items-center gap-1">
                <Typography sx={{ fontSize: 10, color: "#64748b" }}>{point.value}</Typography>
                <Box className="w-full rounded-t-md" sx={{ height: `${Math.max(height, 8)}%`, background: "linear-gradient(180deg, #6366f1, #818cf8)", minHeight: 4 }} />
                <Typography sx={{ fontSize: 9, color: "#94a3b8" }}>
                  {new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
