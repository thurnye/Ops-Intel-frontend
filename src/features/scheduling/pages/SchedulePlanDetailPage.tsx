import {
  Box, Button, Card, CardContent, Chip, Container, Grid, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography
} from "@mui/material";
import { useEffect } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Link as RouterLink, useParams } from "react-router-dom";
import { FieldHelp } from "@app/components/FieldHelp";
import { useAppDispatch, useAppSelector } from "@app/hooks/app.hooks";
import { useSchedulePlanDetail } from "@features/scheduling/hooks/useScheduling";
import { fetchSchedulePlanById } from "@features/scheduling/redux/scheduling.thunks";
import {
  planStatusLabel, planStatusColor,
  generationModeLabel, strategyLabel,
  jobStatusLabel, jobStatusColor,
  formatDate
} from "@features/scheduling/utils/scheduling.utils";

export function SchedulePlanDetailPage() {
  const { planId } = useParams<{ planId: string }>();
  const dispatch = useAppDispatch();
  const plan = useSchedulePlanDetail(planId);
  const { detailLoading } = useAppSelector((state) => state.scheduling);

  useEffect(() => {
    if (planId && !plan) {
      void dispatch(fetchSchedulePlanById(planId));
    }
  }, [dispatch, plan, planId]);

  if (detailLoading && !plan) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography variant="h6" color="text.secondary">Loading schedule plan...</Typography>
      </Container>
    );
  }

  if (!plan) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography variant="h6" color="text.secondary">Schedule plan not found</Typography>
      </Container>
    );
  }
  const quickInfoItems = [
    { label: "Warehouse", value: plan.warehouseName ?? plan.warehouseId, help: "The warehouse anchors the plan to a physical operational location and planning horizon." },
    { label: "Planning Period", value: `${formatDate(plan.planningStartDateUtc)} — ${formatDate(plan.planningEndDateUtc)}`, help: "Planning period is the time window the schedule plan is intended to cover." },
    { label: "Generation Mode", value: generationModeLabel(plan.generationMode), help: "Generation mode describes whether the plan was created manually, semi-automatically, or automatically." },
    { label: "Strategy", value: strategyLabel(plan.schedulingStrategy), help: "Scheduling strategy defines how work is placed in time, such as forward, backward, finite-capacity, or constraint-based scheduling." },
    { label: "Version", value: `v${plan.versionNumber}`, help: "Version tracks the revision of the plan so schedule changes remain auditable over time." },
    { label: "Time Zone", value: plan.timeZone, help: "Time zone controls how the plan's time-bound work windows are interpreted and displayed." },
    { label: "Auto-Sequence", value: plan.autoSequenceEnabled ? "Yes" : "No", help: "Auto-sequence allows the system to order work automatically instead of relying only on manual sequencing." },
    { label: "Auto-Dispatch", value: plan.autoDispatchEnabled ? "Yes" : "No", help: "Auto-dispatch allows the system to automatically release work into execution queues when rules are met." },
    { label: "Approved By", value: plan.approvedBy ? `${plan.approvedBy} (${formatDate(plan.approvedAtUtc!)})` : "—", help: "Approved by shows who formally approved the schedule plan for use." }
  ];

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      {/* Header */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <Typography variant="h4">{plan.planNumber}</Typography>
          <Chip
            label={planStatusLabel(plan.status)}
            size="small"
            sx={{ bgcolor: planStatusColor(plan.status) + "18", color: planStatusColor(plan.status), fontWeight: 600 }}
          />
          {plan.isActive && <Chip label="Active" size="small" color="success" variant="outlined" sx={{ height: 22, fontSize: 11 }} />}
        </Stack>
        <Button component={RouterLink} to={`/scheduling/plans/${plan.id}/edit`} variant="outlined" startIcon={<EditOutlinedIcon />}>
          Edit Plan
        </Button>
      </Stack>

      <Typography sx={{ fontSize: 15, color: "#334155" }}>{plan.name}</Typography>
      {plan.description && <Typography sx={{ fontSize: 13, color: "#64748b" }}>{plan.description}</Typography>}

      {/* Quick info */}
      <Grid container spacing={2.5}>
        {quickInfoItems.map((item) => (
          <Grid key={item.label} size={{ xs: 6, md: 4 }}>
            <Box>
              <Stack direction="row" spacing={0.5} alignItems="center" mb={0.25}>
                <Typography sx={{ fontSize: 12, color: "#64748b" }}>{item.label}</Typography>
                <FieldHelp title={item.label} description={item.help} />
              </Stack>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{item.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Summary stats */}
      <Grid container spacing={2.5}>
        {[
          { label: "Total Jobs", value: plan.totalJobs, color: "#6366f1" },
          { label: "Total Operations", value: plan.totalOperations, color: "#3b82f6" },
          { label: "Exceptions", value: plan.totalExceptions, color: "#ef4444" },
          { label: "Revisions", value: plan.totalRevisions, color: "#8b5cf6" }
        ].map((s) => (
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

      {/* Jobs table */}
      {plan.jobs.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Jobs in Plan</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Job #</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Planned Qty</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plan.jobs.map((j) => (
                    <TableRow key={j.id} hover>
                      <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#6366f1" }}>{j.jobNumber}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{j.jobName}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{j.plannedQuantity}</TableCell>
                      <TableCell>
                        <Chip label={jobStatusLabel(j.status)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: jobStatusColor(j.status) + "18", color: jobStatusColor(j.status), fontWeight: 600 }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{formatDate(j.dueDateUtc)}</TableCell>
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
