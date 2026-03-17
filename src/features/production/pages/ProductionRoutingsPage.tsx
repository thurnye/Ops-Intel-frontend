import { useEffect, useMemo, useState } from 'react';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
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
import { productionApi } from '@features/production/services/production.api.service';
import type {
  RoutingSummary,
  RoutingMetricsSummary,
} from '@features/production/types/production.types';
import {
  getApiData,
  getErrorMessage,
  getPagedItems,
} from '@shared/utils/asyncThunk.utils';

export function ProductionRoutingsPage() {
  const [routings, setRoutings] = useState<RoutingSummary[]>([]);
  const [summary, setSummary] = useState<RoutingMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      productionApi.listRoutings({ pageNumber: 1, pageSize: 100 }),
      productionApi.getRoutingsSummary(),
    ])
      .then(([routingsResponse, summaryResponse]) => {
        setRoutings(getPagedItems(routingsResponse));
        setSummary(getApiData(summaryResponse, null));
      })
      .catch((loadError) =>
        setError(getErrorMessage(loadError, 'Failed to load routings.')),
      );
  }, []);

  const columns = useMemo<AppDataTableColumnDef<RoutingSummary>[]>(
    () => [
      { accessorKey: 'routingCode', header: 'Routing' },
      { accessorKey: 'name', header: 'Name' },
      {
        accessorKey: 'productName',
        header: 'Product',
        cell: ({ row }) => row.original.productName ?? '—',
      },
      { accessorKey: 'version', header: 'Version', meta: { align: 'center' } },
      {
        accessorKey: 'isDefault',
        header: 'Default',
        cell: ({ row }) =>
          row.original.isDefault ? (
            <Chip
              label='Default'
              size='small'
              sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 700 }}
            />
          ) : (
            '—'
          ),
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

  const activeRoutings =
    summary?.activeRoutings ??
    routings.filter((routing) => routing.isActive).length;
  const defaultRoutings =
    summary?.defaultRoutings ??
    routings.filter((routing) => routing.isDefault).length;
  const productCoverage =
    summary?.productCoverage ??
    new Set(routings.map((routing) => routing.productId).filter(Boolean)).size;

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
          variant="body2" color="text.secondary"
        >
          Process Blueprint
        </Typography>
        <Typography variant='h4' sx={{ mt: 0.8, fontWeight: 800 }}>
          Routings
        </Typography>
        <Typography
          sx={{ fontSize: 14, maxWidth: 760, mt: 1 }}
          variant='body2'
          color='text.secondary'
        >
          Track the production process blueprints that define work-center flow
          and sequencing. The stronger operational signal here is
          default-routing coverage and how much of the product mix already has a
          usable routing attached.
        </Typography>
      </Box>
      {error ? <Alert severity='error'>{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Routings'
            value={summary?.totalRoutings ?? routings.length}
            icon={<AccountTreeOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Total routing records in the database.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Active'
            value={activeRoutings}
            tone='#16a34a'
            icon={<TaskAltOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Routings ready for active scheduling and execution use.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Defaults'
            value={defaultRoutings}
            tone='#7c3aed'
            icon={<StarOutlineOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Products with a primary routing decision already defined.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Product Coverage'
            value={productCoverage}
            tone='#2563eb'
            icon={<Inventory2OutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Distinct products currently mapped to routing definitions.'
          />
        </Grid>
      </Grid>
      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable
            columns={columns}
            data={routings}
            emptyState='No routings found.'
          />
        </CardContent>
      </Card>
    </Container>
  );
}
