import { Box, Card, CardContent, Container, Grid, Stack, Typography } from "@mui/material";
import { ProductionBoard } from "@features/production/components/ProductionBoard";
import { useProduction } from "@features/production/hooks/useProduction";

export function ProductionOverviewPage() {
  const { workOrders, filteredJobs } = useProduction();
  const inProgress = workOrders.filter((j) => j.status === "in_progress").length;
  const blocked = workOrders.filter((j) => j.status === "blocked").length;
  const completed = workOrders.filter((j) => j.status === "completed").length;

  const stats = [
    { label: "Total Jobs", value: workOrders.length, color: "#6366f1" },
    { label: "In Progress", value: inProgress, color: "#3b82f6" },
    { label: "Blocked", value: blocked, color: "#ef4444" },
    { label: "Completed", value: completed, color: "#10b981" }
  ];

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Production</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Monitor active work orders and production line status
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
        <Typography variant="h6" mb={2}>Active Jobs</Typography>
        <ProductionBoard jobs={filteredJobs} />
      </Box>
    </Container>
  );
}
