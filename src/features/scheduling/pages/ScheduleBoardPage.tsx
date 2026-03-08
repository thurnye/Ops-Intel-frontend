import { Box, Card, CardContent, Container, Grid, Stack, Typography } from "@mui/material";
import { ScheduleTimeline } from "@features/scheduling/components/ScheduleTimeline";
import { useScheduling } from "@features/scheduling/hooks/useScheduling";

export function ScheduleBoardPage() {
  const { entries, filteredEntries } = useScheduling();
  const planned = entries.filter((e) => e.status === "planned" || e.status === "confirmed").length;
  const active = entries.filter((e) => e.status === "in_progress").length;
  const conflicts = entries.filter((e) => e.status === "conflict").length;
  const completed = entries.filter((e) => e.status === "completed").length;

  const stats = [
    { label: "Planned", value: planned, color: "#6366f1" },
    { label: "Active", value: active, color: "#3b82f6" },
    { label: "Conflicts", value: conflicts, color: "#ef4444" },
    { label: "Completed", value: completed, color: "#10b981" }
  ];

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Schedule Board</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Plan and assign production jobs to time slots and resources
          {conflicts > 0 && (
            <Box component="span" sx={{ color: "#ef4444", fontWeight: 600 }}> — {conflicts} conflict(s) detected</Box>
          )}
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#64748b", mb: 0.5 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box>
        <Typography variant="h6" mb={2}>Schedule Entries</Typography>
        <ScheduleTimeline entries={filteredEntries} />
      </Box>
    </Container>
  );
}
