import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { ScheduleEntry } from "@features/scheduling/types/scheduling.types";
import { scheduleStatusLabel, scheduleStatusColor } from "@features/scheduling/utils/scheduling.utils";

type Props = {
  entries: ScheduleEntry[];
};

export function ScheduleTimeline({ entries }: Props) {
  return (
    <Stack spacing={1.5}>
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{entry.id}</Typography>
                  <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>{entry.jobId}</Typography>
                </Stack>
                <Typography sx={{ fontSize: 13, color: "#334155", mb: 1 }}>{entry.product}</Typography>
                <Stack direction="row" spacing={3}>
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                    Line: <Box component="span" sx={{ fontWeight: 600, color: "#334155" }}>{entry.line}</Box>
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                    Team: <Box component="span" sx={{ fontWeight: 600, color: "#334155" }}>{entry.assignedTo}</Box>
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 1 }}>
                  {new Date(entry.scheduledStart).toLocaleString()} — {new Date(entry.scheduledEnd).toLocaleString()}
                </Typography>
              </Box>
              <Chip label={scheduleStatusLabel(entry.status)} color={scheduleStatusColor(entry.status)} size="small" variant="outlined" sx={{ height: 24 }} />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
