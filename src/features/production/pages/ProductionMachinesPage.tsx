import { useEffect, useMemo, useState } from 'react';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { AppDataTableColumnDef } from '@app/components/AppDataTable';
import { AppDataTable } from '@app/components/AppDataTable';
import { MetricCard } from '@app/components/MetricCard';
import { productionApi } from '@features/production/services/production.api.service';
import type {
  Machine,
  MachineMetricsSummary,
} from '@features/production/types/production.types';
import {
  machineStatusColor,
  machineStatusLabel,
} from '@features/production/utils/production.utils';
import {
  getApiData,
  getErrorMessage,
  getPagedItems,
} from '@shared/utils/asyncThunk.utils';

export function ProductionMachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [summary, setSummary] = useState<MachineMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      productionApi.listMachines({ pageNumber: 1, pageSize: 100 }),
      productionApi.getMachinesSummary(),
    ])
      .then(([machinesResponse, summaryResponse]) => {
        setMachines(getPagedItems(machinesResponse));
        setSummary(getApiData(summaryResponse, null));
      })
      .catch((loadError) =>
        setError(getErrorMessage(loadError, 'Failed to load machines.')),
      );
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Machine>[]>(
    () => [
      { accessorKey: 'machineCode', header: 'Machine' },
      { accessorKey: 'name', header: 'Name' },
      {
        accessorKey: 'workCenterName',
        header: 'Work Center',
        cell: ({ row }) => row.original.workCenterName ?? '—',
      },
      {
        accessorKey: 'manufacturer',
        header: 'Manufacturer',
        cell: ({ row }) => row.original.manufacturer ?? '—',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={machineStatusLabel(row.original.status)}
            size='small'
            sx={{
              bgcolor: `${machineStatusColor(row.original.status)}18`,
              color: machineStatusColor(row.original.status),
              fontWeight: 700,
            }}
          />
        ),
      },
    ],
    [],
  );

  const running =
    summary?.runningMachines ??
    machines.filter((machine) => machine.status === 2).length;
  const maintenance =
    summary?.maintenanceMachines ??
    machines.filter((machine) => machine.status === 4).length;
  const down =
    summary?.downMachines ??
    machines.filter((machine) => machine.status === 3).length;
  const activeCenters =
    summary?.workCentersRepresented ??
    new Set(machines.map((machine) => machine.workCenterId).filter(Boolean))
      .size;

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
          Capacity Estate
        </Typography>
        <Typography variant='h4' sx={{ mt: 0.8, fontWeight: 800 }}>
          Machines
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
          Keep the machine estate visible across status, work-center alignment,
          and maintenance posture. The main operational signal here is whether
          running capacity is keeping ahead of downtime and maintenance
          exposure.
        </Typography>
      </Box>
      {error ? <Alert severity='error'>{error}</Alert> : null}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        justifyContent='flex-end'
      >
        <Button
          variant='outlined'
          startIcon={<PlaylistAddOutlinedIcon />}
          component={RouterLink}
          to='/production/machines/bulk-import'
        >
          Bulk Import Machines
        </Button>
      </Stack>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Machines'
            value={summary?.totalMachines ?? machines.length}
            icon={<PrecisionManufacturingOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Total machine records in the database.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Running'
            value={running}
            tone='#16a34a'
            icon={<PlayCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Machines currently contributing productive capacity.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Maintenance'
            value={maintenance}
            tone='#f59e0b'
            icon={<BuildCircleOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Assets currently unavailable due to maintenance state.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Down'
            value={down}
            tone='#dc2626'
            icon={<ReportProblemOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Assets currently blocked by downtime or fault state.'
          />
        </Grid>
      </Grid>
      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable
            columns={columns}
            data={machines}
            emptyState='No machines found.'
          />
        </CardContent>
      </Card>
    </Container>
  );
}
