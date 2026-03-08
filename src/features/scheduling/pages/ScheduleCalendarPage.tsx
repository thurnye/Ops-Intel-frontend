import { Box, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import { useScheduling } from "@features/scheduling/hooks/useScheduling";
import { scheduleStatusLabel, scheduleStatusColor } from "@features/scheduling/utils/scheduling.utils";

export function ScheduleCalendarPage() {
  const { entries } = useScheduling();

  const grouped = entries.reduce<Record<string, typeof entries>>((acc, entry) => {
    const day = new Date(entry.scheduledStart).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {});

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Schedule Calendar</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Timeline view of production schedule
        </Typography>
      </Box>

      <Stack spacing={3}>
        {Object.entries(grouped).map(([day, dayEntries]) => (
          <Box key={day}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {day}
            </Typography>
            <Stack spacing={1}>
              {dayEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{entry.product}</Typography>
                        <Typography sx={{ fontSize: 12, color: "#64748b" }}>{entry.line} — {entry.assignedTo}</Typography>
                      </Box>
                      <Chip label={scheduleStatusLabel(entry.status)} color={scheduleStatusColor(entry.status)} size="small" variant="outlined" sx={{ height: 22 }} />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
