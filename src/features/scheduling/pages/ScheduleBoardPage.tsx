import {
  Box, Button, Card, CardContent, Chip, Container, Grid, LinearProgress, Stack,
  TextField, InputAdornment, Typography, MenuItem, Select, type SelectChangeEvent,
  Tab, Tabs
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { useSchedulePlans, useScheduleJobs, useScheduleExceptions } from "@features/scheduling/hooks/useScheduling";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { fetchScheduleExceptions, fetchScheduleJobs, fetchSchedulePlans } from "@features/scheduling/redux/scheduling.thunks";
import { setExceptionFilters, setExceptionsPage, setJobFilters, setJobsPage, setPlanFilters, setPlansPage, setSchedulingPageSize } from "@features/scheduling/redux/slices/scheduling.slice";
import {
  MaterialReadinessStatus,
  ScheduleExceptionSeverity,
  ScheduleExceptionStatus,
  ScheduleGenerationMode,
  SchedulePlanStatus,
  ScheduleJobStatus,
  SchedulePriority,
  SchedulingStrategy,
  type ScheduleException,
  type ScheduleJob,
  type SchedulePlan
} from "@features/scheduling/types/scheduling.types";
import {
  planStatusLabel, planStatusColor,
  jobStatusLabel, jobStatusColor,
  priorityLabel, priorityColor,
  materialReadinessLabel, materialReadinessColor,
  exceptionStatusColor, severityColor, severityLabel, exceptionTypeLabel, exceptionStatusLabel,
  jobProgressPercent, formatDate
} from "@features/scheduling/utils/scheduling.utils";

export function ScheduleBoardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const { plans, allPlans, planFilters, page: plansPage, pageSize, pagination: plansPagination } = useSchedulePlans();
  const { jobs, allJobs, jobFilters, page: jobsPage, pagination: jobsPagination } = useScheduleJobs();
  const { exceptions, exceptionFilters, page: exceptionsPage, pagination: exceptionsPagination } = useScheduleExceptions();

  useEffect(() => {
    if (tab === 0) {
      void dispatch(fetchSchedulePlans({ page: plansPage, pageSize, filters: planFilters }));
      return;
    }

    if (tab === 1) {
      void dispatch(fetchScheduleJobs({ page: jobsPage, pageSize, filters: jobFilters }));
      return;
    }

    void dispatch(fetchScheduleExceptions({ page: exceptionsPage, pageSize, filters: exceptionFilters }));
  }, [dispatch, exceptionFilters, exceptionsPage, jobFilters, jobsPage, pageSize, planFilters, plansPage, tab]);

  const running = allJobs.filter((j) => j.status === ScheduleJobStatus.Running).length;
  const blocked = allJobs.filter((j) => j.status === ScheduleJobStatus.Blocked || j.status === ScheduleJobStatus.Delayed).length;
  const completed = allJobs.filter((j) => j.status === ScheduleJobStatus.Completed).length;
  const openExceptions = exceptions.filter((e) => e.status !== 3).length;

  const stats = [
    { label: "Plans", value: plansPagination?.total ?? allPlans.length, color: "#6366f1" },
    { label: "Running Jobs", value: running, color: "#f59e0b" },
    { label: "Blocked / Delayed", value: blocked, color: "#ef4444" },
    { label: "Completed Jobs", value: completed, color: "#10b981" },
    { label: "Open Exceptions", value: openExceptions, color: "#dc2626" }
  ];

  const planColumns = useMemo<AppDataTableColumnDef<SchedulePlan>[]>(
    () => [
      {
        accessorKey: "planNumber",
        header: "Plan #",
        cell: ({ row }) => <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4338ca" }}>{row.original.planNumber}</Typography>
      },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "warehouseName", header: "Warehouse" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Chip label={planStatusLabel(row.original.status)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: planStatusColor(row.original.status) + "18", color: planStatusColor(row.original.status), fontWeight: 700 }} />
        )
      },
      {
        accessorKey: "schedulingStrategy",
        header: "Strategy",
        cell: ({ row }) => row.original.schedulingStrategy === 1 ? "Forward" : row.original.schedulingStrategy === 2 ? "Backward" : row.original.schedulingStrategy === 3 ? "Finite Cap." : row.original.schedulingStrategy === 4 ? "Infinite Cap." : "Constraint"
      },
      {
        accessorKey: "versionNumber",
        header: "Version",
        cell: ({ row }) => `v${row.original.versionNumber}`
      },
      {
        accessorKey: "planningStartDateUtc",
        header: "Start",
        cell: ({ row }) => formatDate(row.original.planningStartDateUtc)
      },
      {
        accessorKey: "planningEndDateUtc",
        header: "End",
        cell: ({ row }) => formatDate(row.original.planningEndDateUtc)
      }
    ],
    []
  );

  const jobColumns = useMemo<AppDataTableColumnDef<ScheduleJob>[]>(
    () => [
      {
        accessorKey: "jobNumber",
        header: "Job #",
        cell: ({ row }) => <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4338ca" }}>{row.original.jobNumber}</Typography>
      },
      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => (
          <Box>
            <Typography sx={{ fontSize: 13 }}>{row.original.productName}</Typography>
            <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>{row.original.productSku}</Typography>
          </Box>
        )
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <Chip label={priorityLabel(row.original.priority)} size="small" variant="outlined" sx={{ height: 22, fontSize: 11, borderColor: priorityColor(row.original.priority), color: priorityColor(row.original.priority) }} />
        )
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Chip label={jobStatusLabel(row.original.status)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: jobStatusColor(row.original.status) + "18", color: jobStatusColor(row.original.status), fontWeight: 700 }} />
        )
      },
      {
        accessorKey: "materialReadinessStatus",
        header: "Material",
        cell: ({ row }) => (
          <Chip label={materialReadinessLabel(row.original.materialReadinessStatus)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: materialReadinessColor(row.original.materialReadinessStatus) + "18", color: materialReadinessColor(row.original.materialReadinessStatus), fontWeight: 700 }} />
        )
      },
      {
        id: "progress",
        header: "Progress",
        meta: { width: 180 },
        cell: ({ row }) => {
          const pct = jobProgressPercent(row.original.completedQuantity, row.original.plannedQuantity);

          return (
            <Stack direction="row" alignItems="center" spacing={1}>
              <LinearProgress variant="determinate" value={pct} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { borderRadius: 3 } }} />
              <Typography sx={{ fontSize: 12, fontWeight: 700, minWidth: 32, textAlign: "right" }}>{pct}%</Typography>
            </Stack>
          );
        }
      },
      {
        accessorKey: "dueDateUtc",
        header: "Due Date",
        cell: ({ row }) => formatDate(row.original.dueDateUtc)
      }
    ],
    []
  );

  const exceptionColumns = useMemo<AppDataTableColumnDef<ScheduleException>[]>(
    () => [
      {
        accessorKey: "severity",
        header: "Severity",
        cell: ({ row }) => (
          <Chip label={severityLabel(row.original.severity)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: severityColor(row.original.severity) + "18", color: severityColor(row.original.severity), fontWeight: 700 }} />
        )
      },
      { accessorKey: "exceptionType", header: "Type", cell: ({ row }) => exceptionTypeLabel(row.original.exceptionType) },
      { accessorKey: "title", header: "Title", cell: ({ row }) => <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{row.original.title}</Typography> },
      { accessorKey: "description", header: "Description", cell: ({ row }) => <Typography sx={{ fontSize: 12, color: "#64748b" }}>{row.original.description}</Typography> },
      { accessorKey: "assignedTo", header: "Assigned To", cell: ({ row }) => row.original.assignedTo ?? "—" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Chip label={exceptionStatusLabel(row.original.status)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: exceptionStatusColor(row.original.status) + "18", color: exceptionStatusColor(row.original.status), fontWeight: 700 }} />
        )
      },
      { accessorKey: "detectedAtUtc", header: "Detected", cell: ({ row }) => formatDate(row.original.detectedAtUtc) }
    ],
    []
  );

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
        <Box>
          <Typography variant="h4">Scheduling</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
            Manage schedule plans, jobs, and monitor exceptions
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button component={RouterLink} to="/scheduling/plans/new" variant="contained" startIcon={<AddIcon />}>
            New Plan
          </Button>
          <Button component={RouterLink} to="/scheduling/jobs/new" variant="outlined" startIcon={<AddIcon />}>
            New Job
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2.5}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 2.4 }}>
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
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Schedule Plans" />
          <Tab label="Schedule Jobs" />
          <Tab label={`Exceptions (${openExceptions})`} />
        </Tabs>

        {/* ── Plans Tab ──────────────────────────── */}
        {tab === 0 && (
          <>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
              <TextField
                size="small"
                placeholder="Search plans..."
                value={planFilters.query}
                onChange={(e) => {
                  dispatch(setPlansPage(1));
                  dispatch(setPlanFilters({ query: e.target.value }));
                }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment> } }}
                sx={{ minWidth: 260 }}
              />
              <Select
                size="small"
                value={String(planFilters.status)}
                onChange={(e: SelectChangeEvent<string>) => {
                  dispatch(setPlansPage(1));
                  dispatch(setPlanFilters({ status: e.target.value === "all" ? "all" : Number(e.target.value) as SchedulePlanStatus }));
                }}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value={SchedulePlanStatus.Draft}>Draft</MenuItem>
                <MenuItem value={SchedulePlanStatus.Published}>Published</MenuItem>
                <MenuItem value={SchedulePlanStatus.InProgress}>In Progress</MenuItem>
                <MenuItem value={SchedulePlanStatus.Closed}>Closed</MenuItem>
                <MenuItem value={SchedulePlanStatus.Cancelled}>Cancelled</MenuItem>
              </Select>
              <Select
                size="small"
                value={String(planFilters.generationMode)}
                onChange={(e: SelectChangeEvent<string>) => {
                  dispatch(setPlansPage(1));
                  dispatch(setPlanFilters({ generationMode: e.target.value === "all" ? "all" : Number(e.target.value) as ScheduleGenerationMode }));
                }}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="all">All Modes</MenuItem>
                <MenuItem value={ScheduleGenerationMode.Manual}>Manual</MenuItem>
                <MenuItem value={ScheduleGenerationMode.SemiAutomatic}>Semi-auto</MenuItem>
                <MenuItem value={ScheduleGenerationMode.Automatic}>Automatic</MenuItem>
              </Select>
              <Select
                size="small"
                value={String(planFilters.schedulingStrategy)}
                onChange={(e: SelectChangeEvent<string>) => {
                  dispatch(setPlansPage(1));
                  dispatch(setPlanFilters({ schedulingStrategy: e.target.value === "all" ? "all" : Number(e.target.value) as SchedulingStrategy }));
                }}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All Strategies</MenuItem>
                <MenuItem value={SchedulingStrategy.Forward}>Forward</MenuItem>
                <MenuItem value={SchedulingStrategy.Backward}>Backward</MenuItem>
                <MenuItem value={SchedulingStrategy.FiniteCapacity}>Finite Capacity</MenuItem>
                <MenuItem value={SchedulingStrategy.InfiniteCapacity}>Infinite Capacity</MenuItem>
                <MenuItem value={SchedulingStrategy.ConstraintBased}>Constraint Based</MenuItem>
              </Select>
              <Select
                size="small"
                value={String(planFilters.isActive)}
                onChange={(e: SelectChangeEvent<string>) => {
                  dispatch(setPlansPage(1));
                  dispatch(setPlanFilters({ isActive: e.target.value === "all" ? "all" : e.target.value === "true" }));
                }}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="all">All States</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
              <TextField
                size="small"
                type="date"
                label="Start From"
                value={planFilters.startDate}
                onChange={(e) => {
                  dispatch(setPlansPage(1));
                  dispatch(setPlanFilters({ startDate: e.target.value }));
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                size="small"
                type="date"
                label="End To"
                value={planFilters.endDate}
                onChange={(e) => {
                  dispatch(setPlansPage(1));
                  dispatch(setPlanFilters({ endDate: e.target.value }));
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <AppDataTable
                  columns={planColumns}
                  data={plans}
                  emptyState="No schedule plans found."
                  manualPagination
                  pageIndex={plansPage - 1}
                  pageSize={pageSize}
                  totalRows={plansPagination?.total ?? 0}
                  onPageChange={(pageIndex) => dispatch(setPlansPage(pageIndex + 1))}
                  onPageSizeChange={(nextPageSize) => {
                    dispatch(setSchedulingPageSize(nextPageSize));
                    dispatch(setPlansPage(1));
                    dispatch(setJobsPage(1));
                    dispatch(setExceptionsPage(1));
                  }}
                  onRowClick={(plan) => navigate(`plans/${plan.id}`)}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* ── Jobs Tab ───────────────────────────── */}
        {tab === 1 && (
          <>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
              <TextField
                size="small"
                placeholder="Search jobs..."
                value={jobFilters.query}
                onChange={(e) => {
                  dispatch(setJobsPage(1));
                  dispatch(setJobFilters({ query: e.target.value }));
                }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment> } }}
                sx={{ minWidth: 260 }}
              />
              <Select
                size="small"
                value={String(jobFilters.status)}
                onChange={(e: SelectChangeEvent<string>) => {
                  dispatch(setJobsPage(1));
                  dispatch(setJobFilters({ status: e.target.value === "all" ? "all" : Number(e.target.value) as ScheduleJobStatus }));
                }}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value={ScheduleJobStatus.Unscheduled}>Unscheduled</MenuItem>
                <MenuItem value={ScheduleJobStatus.Scheduled}>Scheduled</MenuItem>
                <MenuItem value={ScheduleJobStatus.Released}>Released</MenuItem>
                <MenuItem value={ScheduleJobStatus.Running}>Running</MenuItem>
                <MenuItem value={ScheduleJobStatus.Paused}>Paused</MenuItem>
                <MenuItem value={ScheduleJobStatus.Completed}>Completed</MenuItem>
                <MenuItem value={ScheduleJobStatus.Delayed}>Delayed</MenuItem>
                <MenuItem value={ScheduleJobStatus.Blocked}>Blocked</MenuItem>
                <MenuItem value={ScheduleJobStatus.Cancelled}>Cancelled</MenuItem>
              </Select>
              <Select
                size="small"
                value={String(jobFilters.priority)}
                onChange={(e: SelectChangeEvent<string>) => {
                  dispatch(setJobsPage(1));
                  dispatch(setJobFilters({ priority: e.target.value === "all" ? "all" : Number(e.target.value) as SchedulePriority }));
                }}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value={SchedulePriority.Low}>Low</MenuItem>
                <MenuItem value={SchedulePriority.Normal}>Normal</MenuItem>
                <MenuItem value={SchedulePriority.High}>High</MenuItem>
                <MenuItem value={SchedulePriority.Urgent}>Urgent</MenuItem>
                <MenuItem value={SchedulePriority.Critical}>Critical</MenuItem>
              </Select>
              <Select
                size="small"
                value={String(jobFilters.materialReadinessStatus)}
                onChange={(e: SelectChangeEvent<string>) => {
                  dispatch(setJobsPage(1));
                  dispatch(setJobFilters({ materialReadinessStatus: e.target.value === "all" ? "all" : Number(e.target.value) as MaterialReadinessStatus }));
                }}
                sx={{ minWidth: 190 }}
              >
                <MenuItem value="all">All Material States</MenuItem>
                <MenuItem value={MaterialReadinessStatus.Ready}>Ready</MenuItem>
                <MenuItem value={MaterialReadinessStatus.PartiallyReady}>Partially Ready</MenuItem>
                <MenuItem value={MaterialReadinessStatus.Shortage}>Shortage</MenuItem>
                <MenuItem value={MaterialReadinessStatus.Blocked}>Blocked</MenuItem>
              </Select>
              <Select
                size="small"
                value={String(jobFilters.isRushOrder)}
                onChange={(e: SelectChangeEvent<string>) => {
                  dispatch(setJobsPage(1));
                  dispatch(setJobFilters({ isRushOrder: e.target.value === "all" ? "all" : e.target.value === "true" }));
                }}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Rush Flags</MenuItem>
                <MenuItem value="true">Rush Only</MenuItem>
                <MenuItem value="false">Standard Only</MenuItem>
              </Select>
              <TextField
                size="small"
                type="date"
                label="Start From"
                value={jobFilters.startDate}
                onChange={(e) => {
                  dispatch(setJobsPage(1));
                  dispatch(setJobFilters({ startDate: e.target.value }));
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                size="small"
                type="date"
                label="End To"
                value={jobFilters.endDate}
                onChange={(e) => {
                  dispatch(setJobsPage(1));
                  dispatch(setJobFilters({ endDate: e.target.value }));
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <AppDataTable
                  columns={jobColumns}
                  data={jobs}
                  emptyState="No schedule jobs found."
                  manualPagination
                  pageIndex={jobsPage - 1}
                  pageSize={pageSize}
                  totalRows={jobsPagination?.total ?? 0}
                  onPageChange={(pageIndex) => dispatch(setJobsPage(pageIndex + 1))}
                  onPageSizeChange={(nextPageSize) => {
                    dispatch(setSchedulingPageSize(nextPageSize));
                    dispatch(setPlansPage(1));
                    dispatch(setJobsPage(1));
                    dispatch(setExceptionsPage(1));
                  }}
                  onRowClick={(job) => navigate(`jobs/${job.id}`)}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* ── Exceptions Tab ─────────────────────── */}
        {tab === 2 && (
          <>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
              <TextField
                size="small"
                placeholder="Search exceptions..."
                value={exceptionFilters.query}
                onChange={(e) => {
                  dispatch(setExceptionsPage(1));
                  dispatch(setExceptionFilters({ query: e.target.value }));
                }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment> } }}
                sx={{ minWidth: 260 }}
              />
              <Select
                size="small"
                value={String(exceptionFilters.status)}
                onChange={(e: SelectChangeEvent<string>) => {
                  dispatch(setExceptionsPage(1));
                  dispatch(setExceptionFilters({ status: e.target.value === "all" ? "all" : Number(e.target.value) as ScheduleExceptionStatus }));
                }}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value={ScheduleExceptionStatus.Open}>Open</MenuItem>
                <MenuItem value={ScheduleExceptionStatus.Investigating}>Investigating</MenuItem>
                <MenuItem value={ScheduleExceptionStatus.Resolved}>Resolved</MenuItem>
                <MenuItem value={ScheduleExceptionStatus.Ignored}>Ignored</MenuItem>
              </Select>
              <Select
                size="small"
                value={String(exceptionFilters.severity)}
                onChange={(e: SelectChangeEvent<string>) => {
                  dispatch(setExceptionsPage(1));
                  dispatch(setExceptionFilters({ severity: e.target.value === "all" ? "all" : Number(e.target.value) as ScheduleExceptionSeverity }));
                }}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Severities</MenuItem>
                <MenuItem value={ScheduleExceptionSeverity.Low}>Low</MenuItem>
                <MenuItem value={ScheduleExceptionSeverity.Medium}>Medium</MenuItem>
                <MenuItem value={ScheduleExceptionSeverity.High}>High</MenuItem>
                <MenuItem value={ScheduleExceptionSeverity.Critical}>Critical</MenuItem>
              </Select>
              <TextField
                size="small"
                placeholder="Assigned to..."
                value={exceptionFilters.assignedTo}
                onChange={(e) => {
                  dispatch(setExceptionsPage(1));
                  dispatch(setExceptionFilters({ assignedTo: e.target.value }));
                }}
                sx={{ minWidth: 180 }}
              />
              <TextField
                size="small"
                type="date"
                label="Detected From"
                value={exceptionFilters.startDate}
                onChange={(e) => {
                  dispatch(setExceptionsPage(1));
                  dispatch(setExceptionFilters({ startDate: e.target.value }));
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                size="small"
                type="date"
                label="Detected To"
                value={exceptionFilters.endDate}
                onChange={(e) => {
                  dispatch(setExceptionsPage(1));
                  dispatch(setExceptionFilters({ endDate: e.target.value }));
                }}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <AppDataTable
                  columns={exceptionColumns}
                  data={exceptions}
                  emptyState="No exceptions."
                  manualPagination
                  pageIndex={exceptionsPage - 1}
                  pageSize={pageSize}
                  totalRows={exceptionsPagination?.total ?? 0}
                  onPageChange={(pageIndex) => dispatch(setExceptionsPage(pageIndex + 1))}
                  onPageSizeChange={(nextPageSize) => {
                    dispatch(setSchedulingPageSize(nextPageSize));
                    dispatch(setPlansPage(1));
                    dispatch(setJobsPage(1));
                    dispatch(setExceptionsPage(1));
                  }}
                />
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Container>
  );
}
