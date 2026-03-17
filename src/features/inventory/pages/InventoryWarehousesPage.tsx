import { useEffect, useMemo, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import AddIcon from '@mui/icons-material/Add';
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
import { z } from 'zod';
import type { AppDataTableColumnDef } from '@app/components/AppDataTable';
import { AppDataTable } from '@app/components/AppDataTable';
import { MetricCard } from '@app/components/MetricCard';
import {
  EntityCrudDialog,
  type EntityFieldConfig,
} from '@app/components/forms/EntityCrudDialog';
import { inventoryApi } from '@features/inventory/services/inventory.api.service';
import type {
  Warehouse,
  WarehouseMetricsSummary,
  WarehouseUpsertPayload,
} from '@features/inventory/types/inventory.types';
import { getApiData, getErrorMessage } from '@shared/utils/asyncThunk.utils';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().trim().min(2, 'Warehouse name is required.'),
  code: z.string().trim().min(2, 'Warehouse code is required.'),
  description: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  stateOrProvince: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  isActive: z.boolean(),
});

const fields: EntityFieldConfig[] = [
  { name: 'name', label: 'Warehouse Name' },
  { name: 'code', label: 'Code' },
  { name: 'description', label: 'Description', kind: 'multiline' },
  { name: 'addressLine1', label: 'Address Line 1' },
  { name: 'addressLine2', label: 'Address Line 2' },
  { name: 'city', label: 'City' },
  { name: 'stateOrProvince', label: 'State / Province' },
  { name: 'postalCode', label: 'Postal Code' },
  { name: 'country', label: 'Country' },
  { name: 'isActive', label: 'Active', kind: 'switch' },
];

const emptyValues: WarehouseUpsertPayload = {
  name: '',
  code: '',
  description: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  stateOrProvince: '',
  postalCode: '',
  country: '',
  isActive: true,
};

export function InventoryWarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [summary, setSummary] = useState<WarehouseMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    await Promise.all([
      inventoryApi.listWarehouses(),
      inventoryApi.getWarehousesSummary(),
    ])
      .then(([warehousesResponse, summaryResponse]) => {
        setWarehouses(getApiData(warehousesResponse, []));
        setSummary(getApiData(summaryResponse, null));
      })
      .catch((loadError) =>
        setError(getErrorMessage(loadError, 'Failed to load warehouses.')),
      );
  }

  useEffect(() => {
    void loadData();
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Warehouse>[]>(
    () => [
      { accessorKey: 'code', header: 'Code' },
      { accessorKey: 'name', header: 'Warehouse' },
      {
        accessorKey: 'city',
        header: 'City',
        cell: ({ row }) => row.original.city ?? '—',
      },
      {
        accessorKey: 'country',
        header: 'Country',
        cell: ({ row }) => row.original.country ?? '—',
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
      {
        id: 'actions',
        header: 'Actions',
        meta: { align: 'center', width: 140 },
        cell: ({ row }) => (
          <Button
            size='small'
            startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={() => {
              setEditingWarehouse(row.original);
              setIsDialogOpen(true);
            }}
          >
            Edit
          </Button>
        ),
      },
    ],
    [],
  );

  const active =
    summary?.activeWarehouses ??
    warehouses.filter((warehouse) => warehouse.isActive).length;
  const countries =
    summary?.countriesRepresented ??
    new Set(warehouses.map((warehouse) => warehouse.country).filter(Boolean))
      .size;
  const addressReady =
    summary?.addressReadyWarehouses ??
    warehouses.filter(
      (warehouse) =>
        warehouse.addressLine1 && warehouse.city && warehouse.country,
    ).length;

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
          Network Footprint
        </Typography>
        <Typography variant='h4' sx={{ mt: 0.8, fontWeight: 800 }}>
          Warehouses
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
          Monitor the location footprint that supports inventory, production,
          and shipping. The operational quality here depends on active-site
          coverage and address completeness across the network.
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
          to='/inventory/warehouses/bulk-import'
        >
          Bulk Import Warehouses
        </Button>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingWarehouse(null);
            setIsDialogOpen(true);
          }}
        >
          Add Warehouse
        </Button>
      </Stack>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Total Warehouses'
            value={summary?.totalWarehouses ?? warehouses.length}
            icon={<WarehouseOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Registered network sites available to planning and fulfillment.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Active'
            value={active}
            tone='#16a34a'
            icon={<TaskAltOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Sites currently available for operational use.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Countries'
            value={countries}
            tone='#0284c7'
            icon={<PublicOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Geographic spread of the warehouse network.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Address Ready'
            value={addressReady}
            tone='#7c3aed'
            icon={<TaskAltOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Sites with complete location details for downstream logistics flows.'
          />
        </Grid>
      </Grid>
      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable
            columns={columns}
            data={warehouses}
            emptyState='No warehouses found.'
          />
        </CardContent>
      </Card>

      <EntityCrudDialog<WarehouseUpsertPayload>
        open={isDialogOpen}
        title={editingWarehouse ? 'Edit Warehouse' : 'Create Warehouse'}
        description='Save one warehouse record at a time.'
        schema={schema}
        defaultValues={
          editingWarehouse
            ? {
                name: editingWarehouse.name,
                code: editingWarehouse.code,
                description: editingWarehouse.description ?? '',
                addressLine1: editingWarehouse.addressLine1 ?? '',
                addressLine2: editingWarehouse.addressLine2 ?? '',
                city: editingWarehouse.city ?? '',
                stateOrProvince: editingWarehouse.stateOrProvince ?? '',
                postalCode: editingWarehouse.postalCode ?? '',
                country: editingWarehouse.country ?? '',
                isActive: editingWarehouse.isActive,
              }
            : emptyValues
        }
        fields={fields}
        submitting={isSubmitting}
        submitLabel={editingWarehouse ? 'Update Warehouse' : 'Create Warehouse'}
        onClose={() => {
          if (!isSubmitting) {
            setIsDialogOpen(false);
            setEditingWarehouse(null);
          }
        }}
        onSubmit={async (values) => {
          try {
            setIsSubmitting(true);
            if (editingWarehouse) {
              await inventoryApi.updateWarehouse(editingWarehouse.id, values);
              toast.success('Warehouse updated.');
            } else {
              await inventoryApi.createWarehouse(values);
              toast.success('Warehouse created.');
            }
            setIsDialogOpen(false);
            setEditingWarehouse(null);
            await loadData();
          } catch (submitError) {
            toast.error(
              getErrorMessage(submitError, 'Failed to save warehouse.'),
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </Container>
  );
}
