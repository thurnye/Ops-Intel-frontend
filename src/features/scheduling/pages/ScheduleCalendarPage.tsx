import {
  Box, Card, CardContent, Chip, Container, LinearProgress, Stack, Typography
} from "@mui/material";
import { useScheduleJobs } from "@features/scheduling/hooks/useScheduling";
import {
  jobStatusLabel, jobStatusColor,
  priorityLabel, priorityColor,
  materialReadinessLabel, materialReadinessColor,
  jobProgressPercent, formatDateTime
} from "@features/scheduling/utils/scheduling.utils";

export function ScheduleCalendarPage() {
  const { allJobs } = useScheduleJobs();

  const grouped = allJobs.reduce<Record<string, typeof allJobs>>((acc, job) => {
    const day = new Date(job.plannedStartUtc).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    if (!acc[day]) acc[day] = [];
    acc[day].push(job);
    return acc;
  }, {});

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Schedule Calendar</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Timeline view of scheduled jobs by day
        </Typography>
      </Box>

      <Stack spacing={3}>
        {Object.entries(grouped).map(([day, dayJobs]) => (
          <Box key={day}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {day}
            </Typography>
            <Stack spacing={1}>
              {dayJobs.map((job) => {
                const pct = jobProgressPercent(job.completedQuantity, job.plannedQuantity);
                return (
                  <Card key={job.id}>
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{job.jobNumber}</Typography>
                            <Chip label={priorityLabel(job.priority)} size="small" variant="outlined" sx={{ height: 20, fontSize: 10, borderColor: priorityColor(job.priority), color: priorityColor(job.priority) }} />
                            <Chip label={materialReadinessLabel(job.materialReadinessStatus)} size="small" sx={{ height: 20, fontSize: 10, bgcolor: materialReadinessColor(job.materialReadinessStatus) + "18", color: materialReadinessColor(job.materialReadinessStatus) }} />
                          </Stack>
                          <Typography sx={{ fontSize: 13, color: "#334155" }}>{job.productName}</Typography>
                          <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.5 }}>
                            {formatDateTime(job.plannedStartUtc)} — {formatDateTime(job.plannedEndUtc)}
                          </Typography>
                          {pct > 0 && (
                            <Stack direction="row" alignItems="center" spacing={1} mt={1} sx={{ maxWidth: 200 }}>
                              <LinearProgress variant="determinate" value={pct} sx={{ flex: 1, height: 5, borderRadius: 3, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { borderRadius: 3 } }} />
                              <Typography sx={{ fontSize: 11, fontWeight: 600 }}>{pct}%</Typography>
                            </Stack>
                          )}
                        </Box>
                        <Chip label={jobStatusLabel(job.status)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: jobStatusColor(job.status) + "18", color: jobStatusColor(job.status), fontWeight: 600 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
