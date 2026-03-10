import {
  Box, Card, CardContent, Chip, Container, Grid, LinearProgress, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography
} from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/hooks/app.hooks";
import { useScheduleJobDetail } from "@features/scheduling/hooks/useScheduling";
import { fetchScheduleJobById } from "@features/scheduling/redux/scheduling.thunks";
import {
  jobStatusLabel, jobStatusColor,
  operationStatusLabel, operationStatusColor,
  priorityLabel, priorityColor,
  materialReadinessLabel, materialReadinessColor,
  jobProgressPercent, formatDate, formatDateTime
} from "@features/scheduling/utils/scheduling.utils";

export function ScheduleJobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const dispatch = useAppDispatch();
  const job = useScheduleJobDetail(jobId);
  const { detailLoading } = useAppSelector((state) => state.scheduling);

  useEffect(() => {
    if (jobId && !job) {
      void dispatch(fetchScheduleJobById(jobId));
    }
  }, [dispatch, job, jobId]);

  if (detailLoading && !job) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography variant="h6" color="text.secondary">Loading schedule job...</Typography>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography variant="h6" color="text.secondary">Schedule job not found</Typography>
      </Container>
    );
  }

  const pct = jobProgressPercent(job.completedQuantity, job.plannedQuantity);

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
        <Typography variant="h4">{job.jobNumber}</Typography>
        <Chip
          label={jobStatusLabel(job.status)}
          size="small"
          sx={{ bgcolor: jobStatusColor(job.status) + "18", color: jobStatusColor(job.status), fontWeight: 600 }}
        />
        <Chip
          label={priorityLabel(job.priority)}
          size="small"
          variant="outlined"
          sx={{ borderColor: priorityColor(job.priority), color: priorityColor(job.priority) }}
        />
        <Chip
          label={materialReadinessLabel(job.materialReadinessStatus)}
          size="small"
          sx={{ height: 22, fontSize: 11, bgcolor: materialReadinessColor(job.materialReadinessStatus) + "18", color: materialReadinessColor(job.materialReadinessStatus), fontWeight: 600 }}
        />
      </Stack>

      <Typography sx={{ fontSize: 15, color: "#334155" }}>{job.jobName}</Typography>

      {/* Quick info */}
      <Grid container spacing={2.5}>
        {[
          { label: "Product", value: `${job.productName ?? "—"} (${job.productSku ?? "—"})` },
          { label: "Warehouse", value: job.warehouseName ?? job.warehouseId },
          { label: "Planned Start", value: formatDateTime(job.plannedStartUtc) },
          { label: "Planned End", value: formatDateTime(job.plannedEndUtc) },
          { label: "Actual Start", value: job.actualStartUtc ? formatDateTime(job.actualStartUtc) : "—" },
          { label: "Due Date", value: formatDate(job.dueDateUtc) }
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 6, md: 4 }}>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#64748b", mb: 0.25 }}>{item.label}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{item.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Progress */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>Production Progress</Typography>
          <Stack direction="row" spacing={4} mb={2}>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#64748b" }}>Planned</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{job.plannedQuantity}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#64748b" }}>Completed</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#10b981" }}>{job.completedQuantity}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#64748b" }}>Scrap</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#ef4444" }}>{job.scrapQuantity}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>Completion</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{pct}%</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{ height: 8, borderRadius: 4, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { borderRadius: 4 } }}
          />
        </CardContent>
      </Card>

      {/* Summary stats */}
      <Grid container spacing={2.5}>
        {[
          { label: "Operations", value: job.totalOperations, color: "#3b82f6" },
          { label: "Exceptions", value: job.totalExceptions, color: "#ef4444" },
          { label: "Material Checks", value: job.totalMaterialChecks, color: "#8b5cf6" }
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 4 }}>
            <Card>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#64748b", mb: 0.5 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Operations table */}
      {job.operations.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Operations</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Seq</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Operation</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Planned Start</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Planned End</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {job.operations.map((op) => (
                    <TableRow key={op.id}>
                      <TableCell sx={{ fontSize: 13 }}>{op.sequenceNo}</TableCell>
                      <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{op.operationCode}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{op.operationName}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{formatDateTime(op.plannedStartUtc)}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{formatDateTime(op.plannedEndUtc)}</TableCell>
                      <TableCell>
                        <Chip label={operationStatusLabel(op.status)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: operationStatusColor(op.status) + "18", color: operationStatusColor(op.status), fontWeight: 600 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Material checks table */}
      {job.materialChecks.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Material Checks</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Material</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Warehouse</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Required</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Available</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Reserved</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Shortage</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Checked</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {job.materialChecks.map((mc) => (
                    <TableRow key={mc.id}>
                      <TableCell sx={{ fontSize: 13 }}>{mc.materialProductName ?? mc.materialProductId}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{mc.warehouseName ?? mc.warehouseId}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{mc.requiredQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{mc.availableQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{mc.reservedQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13, color: mc.shortageQuantity > 0 ? "#ef4444" : undefined }} align="right">{mc.shortageQuantity}</TableCell>
                      <TableCell>
                        <Chip label={materialReadinessLabel(mc.status)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: materialReadinessColor(mc.status) + "18", color: materialReadinessColor(mc.status), fontWeight: 600 }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{formatDate(mc.checkedAtUtc)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
