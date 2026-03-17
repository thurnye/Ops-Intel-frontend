import { useEffect, useMemo, useState } from 'react';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import type { AppDataTableColumnDef } from '@app/components/AppDataTable';
import { AppDataTable } from '@app/components/AppDataTable';
import { MetricCard } from '@app/components/MetricCard';
import { schedulingApi } from '@features/scheduling/services/scheduling.api.service';
import type { Shift } from '@features/scheduling/types/scheduling.types';
import {
  getApiData,
  getErrorMessage,
  getPagedItems,
} from '@shared/utils/asyncThunk.utils';

export function SchedulingShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [summary, setSummary] = useState({
    totalShifts: 0,
    activeShifts: 0,
    overnightShifts: 0,
    workCentersRepresented: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      schedulingApi.listShifts({ pageNumber: 1, pageSize: 100 }),
      schedulingApi.getShiftsSummary(),
    ])
      .then(([shiftsResponse, summaryResponse]) => {
        setShifts(getPagedItems(shiftsResponse));
        setSummary(
          getApiData(summaryResponse, {
            totalShifts: 0,
            activeShifts: 0,
            overnightShifts: 0,
            workCentersRepresented: 0,
          }),
        );
      })
      .catch((loadError) =>
        setError(getErrorMessage(loadError, 'Failed to load shifts.')),
      );
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Shift>[]>(
    () => [
      { accessorKey: 'shiftCode', header: 'Shift' },
      { accessorKey: 'shiftName', header: 'Name' },
      {
        accessorKey: 'warehouseName',
        header: 'Warehouse',
        cell: ({ row }) => row.original.warehouseName ?? '—',
      },
      {
        accessorKey: 'workCenterName',
        header: 'Work Center',
        cell: ({ row }) => row.original.workCenterName ?? '—',
      },
      { accessorKey: 'startTime', header: 'Start' },
      { accessorKey: 'endTime', header: 'End' },
      {
        accessorKey: 'isActive',
        header: 'State',
        cell: ({ row }) => (
          <Chip
            label={row.original.isActive ? 'Active' : 'Inactive'}
            size='small'
            sx={{
              bgcolor: row.original.isActive ? '#dbeafe' : '#e2e8f0',
              color: row.original.isActive ? '#1d4ed8' : '#475569',
              fontWeight: 700,
            }}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Container maxWidth={false} disableGutters className='space-y-6'>
      <Box>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
          variant='body2'
          color='text.secondary'
        >
          Capacity Windows
        </Typography>
        <Typography variant='h4' sx={{ mt: 0.8, fontWeight: 800 }}>
          Shifts
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            maxWidth: 760,
            mt: 1,
          }}
          variant='body2'
          color='text.secondary'
        >
          Review the active operating shifts that anchor schedule and dispatch
          timing. The core scheduling signal here is active coverage, overnight
          complexity, and how much of the work-center footprint is actually
          assigned a shift window.
        </Typography>
      </Box>
      {error ? <Alert severity='error'>{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Shifts'
            value={summary.totalShifts}
            icon={<ScheduleOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Total shift records in the database, returned by the backend summary endpoint.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Active'
            value={summary.activeShifts}
            tone='#2563eb'
            icon={<TaskAltOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Shifts currently available for dispatch and planning windows.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Overnight'
            value={summary.overnightShifts}
            tone='#7c3aed'
            icon={<BedtimeOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Shift templates that cross midnight and add sequencing complexity.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Work Centers'
            value={summary.workCentersRepresented}
            tone='#0f766e'
            icon={<FactoryOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Distinct work centers with explicit shift assignment coverage.'
          />
        </Grid>
      </Grid>
      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable
            columns={columns}
            data={shifts}
            emptyState='No shifts found.'
          />
        </CardContent>
      </Card>
    </Container>
  );
}
