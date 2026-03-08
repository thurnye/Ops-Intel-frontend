import { Box, Card, CardContent, Chip, Container, LinearProgress, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@app/hooks/app.hooks";
import { statusLabel, statusColor } from "@features/production/utils/production.utils";

export function ProductionJobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const job = useAppSelector((s) => s.production.workOrders.find((j) => j.id === jobId));

  if (!job) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography variant="h6" color="text.secondary">Job not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h4">{job.id}</Typography>
        <Chip label={statusLabel(job.status)} color={statusColor(job.status)} size="small" />
      </Stack>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
              <Box>
                <Typography sx={{ fontSize: 12, color: "#64748b", mb: 0.25 }}>Product</Typography>
                <Typography sx={{ fontWeight: 600 }}>{job.product}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: "#64748b", mb: 0.25 }}>Production Line</Typography>
                <Typography sx={{ fontWeight: 600 }}>{job.line}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: "#64748b", mb: 0.25 }}>Linked Order</Typography>
                <Typography sx={{ fontWeight: 600 }}>{job.orderId}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: "#64748b", mb: 0.25 }}>Due Date</Typography>
                <Typography sx={{ fontWeight: 600 }}>{new Date(job.dueAt).toLocaleDateString()}</Typography>
              </Box>
            </Stack>
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Progress</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{job.progress}%</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={job.progress}
                sx={{ height: 8, borderRadius: 4, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { borderRadius: 4 } }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
