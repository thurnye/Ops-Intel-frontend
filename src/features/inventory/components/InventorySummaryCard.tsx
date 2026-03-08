import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

type StatItem = {
  label: string;
  value: number | string;
  color: string;
};

type Props = {
  stats: StatItem[];
};

export function InventorySummaryCards({ stats }: Props) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      {stats.map((s) => (
        <Card key={s.label} className="relative flex-1 overflow-hidden">
          <Box className="absolute inset-x-0 top-0 h-1" sx={{ bgcolor: s.color }} />
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>
              {s.label}
            </Typography>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              {s.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
