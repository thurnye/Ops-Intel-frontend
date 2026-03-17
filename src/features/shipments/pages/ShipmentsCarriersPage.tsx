import { useEffect, useMemo, useState } from 'react';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
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
import { shipmentsApi } from '@features/shipments/services/shipments.api.service';
import type {
  Carrier,
  CarrierMetricsSummary,
} from '@features/shipments/types/shipments.types';
import {
  getApiData,
  getErrorMessage,
  getPagedItems,
} from '@shared/utils/asyncThunk.utils';

export function ShipmentsCarriersPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [summary, setSummary] = useState<CarrierMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      shipmentsApi.listCarriers({ pageNumber: 1, pageSize: 100 }),
      shipmentsApi.getCarriersSummary(),
    ])
      .then(([carriersResponse, summaryResponse]) => {
        setCarriers(getPagedItems(carriersResponse));
        setSummary(getApiData(summaryResponse, null));
      })
      .catch((loadError) =>
        setError(getErrorMessage(loadError, 'Failed to load carriers.')),
      );
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Carrier>[]>(
    () => [
      { accessorKey: 'carrierCode', header: 'Code' },
      { accessorKey: 'name', header: 'Carrier' },
      {
        accessorKey: 'contactName',
        header: 'Contact',
        cell: ({ row }) => row.original.contactName ?? '—',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => row.original.email ?? '—',
      },
      {
        id: 'services',
        header: 'Services',
        meta: { align: 'center' },
        cell: ({ row }) => row.original.services.length,
      },
      {
        accessorKey: 'isActive',
        header: 'State',
        cell: ({ row }) => (
          <Chip
            label={row.original.isActive ? 'Active' : 'Inactive'}
            size='small'
            sx={{
              bgcolor: row.original.isActive ? '#dcfce7' : '#e2e8f0',
              color: row.original.isActive ? '#166534' : '#475569',
              fontWeight: 700,
            }}
          />
        ),
      },
    ],
    [],
  );

  const activeCarriers =
    summary?.activeCarriers ??
    carriers.filter((carrier) => carrier.isActive).length;
  const totalServices =
    summary?.totalServices ??
    carriers.reduce((sum, carrier) => sum + carrier.services.length, 0);
  const contactable =
    summary?.contactableCarriers ??
    carriers.filter((carrier) => carrier.email || carrier.phone).length;

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
          Carrier Network
        </Typography>
        <Typography variant='h4' sx={{ mt: 0.8, fontWeight: 800 }}>
          Carriers
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
          Review the carrier network and the service portfolio backing shipment
          execution. The stronger signal here is partner readiness, service
          density, and how reachable each carrier is when exceptions occur.
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
          to='/shipments/carriers/bulk-import'
        >
          Bulk Import Carriers
        </Button>
      </Stack>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Carriers'
            value={summary?.totalCarriers ?? carriers.length}
            icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Total carrier records in the database.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Services'
            value={totalServices}
            tone='#6366f1'
            icon={<RouteOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Delivery services and modes exposed across the carrier roster.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Active'
            value={activeCarriers}
            tone='#16a34a'
            icon={<ChecklistRtlOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Partners currently enabled for operational use.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Contactable'
            value={contactable}
            tone='#0f766e'
            icon={<CallOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Carriers with phone or email context available for issue resolution.'
          />
        </Grid>
      </Grid>
      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable
            columns={columns}
            data={carriers}
            emptyState='No carriers found.'
          />
        </CardContent>
      </Card>
    </Container>
  );
}
