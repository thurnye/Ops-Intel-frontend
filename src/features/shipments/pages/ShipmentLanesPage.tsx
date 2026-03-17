import { useEffect, useMemo, useState } from 'react';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
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
  ShipmentAddress,
  ShipmentAddressMetricsSummary,
} from '@features/shipments/types/shipments.types';
import { getApiData, getErrorMessage } from '@shared/utils/asyncThunk.utils';

export function ShipmentLanesPage() {
  const [lanes, setLanes] = useState<ShipmentAddress[]>([]);
  const [summary, setSummary] = useState<ShipmentAddressMetricsSummary | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      shipmentsApi.searchAddresses({ take: 200 }),
      shipmentsApi.getAddressesSummary(),
    ])
      .then(([lanesResponse, summaryResponse]) => {
        setLanes(getApiData(lanesResponse, []));
        setSummary(getApiData(summaryResponse, null));
      })
      .catch((loadError) =>
        setError(getErrorMessage(loadError, 'Failed to load lane registry.')),
      );
  }, []);

  const columns = useMemo<AppDataTableColumnDef<ShipmentAddress>[]>(
    () => [
      { accessorKey: 'contactName', header: 'Contact' },
      {
        accessorKey: 'companyName',
        header: 'Company',
        cell: ({ row }) => row.original.companyName ?? '—',
      },
      { accessorKey: 'addressType', header: 'Type' },
      { accessorKey: 'city', header: 'City' },
      { accessorKey: 'country', header: 'Country' },
      { accessorKey: 'addressLine1', header: 'Address' },
    ],
    [],
  );

  const countries =
    summary?.countriesRepresented ??
    new Set(lanes.map((lane) => lane.country).filter(Boolean)).size;
  const cities =
    summary?.citiesRepresented ??
    new Set(lanes.map((lane) => lane.city).filter(Boolean)).size;
  const companies =
    summary?.companyBackedAddresses ??
    lanes.filter((lane) => lane.companyName?.trim()).length;

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
          Lane Registry
        </Typography>
        <Typography variant='h4' sx={{ mt: 0.8, fontWeight: 800 }}>
          Lanes
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
          Use the shipment address registry as the operational lane catalog for
          origin and destination handling. This surface is strongest when
          planners can see geographic spread and the quality of address
          ownership.
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
          to='/shipments/lanes/bulk-import'
        >
          Bulk Import Lanes
        </Button>
      </Stack>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Registered Lanes'
            value={summary?.totalAddresses ?? lanes.length}
            icon={<RouteOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Address records that can be reused for shipment lane design.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Countries'
            value={countries}
            tone='#d97706'
            icon={<PublicOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='National footprint of the shipment address registry.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Cities'
            value={cities}
            tone='#2563eb'
            icon={<LocationCityOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Distinct city nodes currently represented in the lane map.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Company Backed'
            value={companies}
            tone='#7c3aed'
            icon={<ApartmentOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Entries tied to an explicit company or site owner.'
          />
        </Grid>
      </Grid>
      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable
            columns={columns}
            data={lanes}
            emptyState='No lane addresses found.'
          />
        </CardContent>
      </Card>
    </Container>
  );
}
