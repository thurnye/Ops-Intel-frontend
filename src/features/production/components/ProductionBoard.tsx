import { Box, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import type { WorkOrder } from "@features/production/types/production.types";
import { statusLabel, statusColor } from "@features/production/utils/production.utils";

type Props = {
  jobs: WorkOrder[];
};

export function ProductionBoard({ jobs }: Props) {
  return (
    <Stack spacing={1.5}>
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{job.id}</Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>{job.product}</Typography>
                </Box>
                <Chip label={statusLabel(job.status)} color={statusColor(job.status)} size="small" variant="outlined" sx={{ height: 24 }} />
              </Stack>
              <Stack direction="row" spacing={3}>
                <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                  Line: <Box component="span" sx={{ fontWeight: 600, color: "#334155" }}>{job.line}</Box>
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                  Order: <Box component="span" sx={{ fontWeight: 600, color: "#334155" }}>{job.orderId}</Box>
                </Typography>
              </Stack>
              <Box>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Progress</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#334155" }}>{job.progress}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={job.progress}
                  sx={{ height: 6, borderRadius: 3, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { borderRadius: 3 } }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
