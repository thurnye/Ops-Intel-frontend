import { useEffect, useMemo, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
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
  Supplier,
  SupplierMetricsSummary,
  SupplierUpsertPayload,
} from '@features/inventory/types/inventory.types';
import { getApiData, getErrorMessage } from '@shared/utils/asyncThunk.utils';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().trim().min(2, 'Supplier name is required.'),
  contactPerson: z.string().optional(),
  email: z.string().email('Enter a valid email.').or(z.literal('')),
  phoneNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  stateOrProvince: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  isActive: z.boolean(),
  notes: z.string().optional(),
});

const fields: EntityFieldConfig[] = [
  { name: 'name', label: 'Supplier Name' },
  { name: 'contactPerson', label: 'Contact Person' },
  { name: 'email', label: 'Email' },
  { name: 'phoneNumber', label: 'Phone' },
  { name: 'addressLine1', label: 'Address Line 1' },
  { name: 'addressLine2', label: 'Address Line 2' },
  { name: 'city', label: 'City' },
  { name: 'stateOrProvince', label: 'State / Province' },
  { name: 'postalCode', label: 'Postal Code' },
  { name: 'country', label: 'Country' },
  { name: 'notes', label: 'Notes', kind: 'multiline' },
  { name: 'isActive', label: 'Active', kind: 'switch' },
];

const emptyValues: SupplierUpsertPayload = {
  name: '',
  contactPerson: '',
  email: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  stateOrProvince: '',
  postalCode: '',
  country: '',
  isActive: true,
  notes: '',
};

export function InventorySuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [summary, setSummary] = useState<SupplierMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    await Promise.all([
      inventoryApi.listSuppliers(),
      inventoryApi.getSuppliersSummary(),
    ])
      .then(([suppliersResponse, summaryResponse]) => {
        setSuppliers(getApiData(suppliersResponse, []));
        setSummary(getApiData(summaryResponse, null));
      })
      .catch((loadError) =>
        setError(getErrorMessage(loadError, 'Failed to load suppliers.')),
      );
  }

  useEffect(() => {
    void loadData();
  }, []);

  const columns = useMemo<AppDataTableColumnDef<Supplier>[]>(
    () => [
      { accessorKey: 'name', header: 'Supplier' },
      {
        accessorKey: 'contactPerson',
        header: 'Contact',
        cell: ({ row }) => row.original.contactPerson ?? '—',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => row.original.email ?? '—',
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
              bgcolor: row.original.isActive ? '#dbeafe' : '#e2e8f0',
              color: row.original.isActive ? '#1d4ed8' : '#475569',
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
              setEditingSupplier(row.original);
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

  const activeSuppliers =
    summary?.activeSuppliers ??
    suppliers.filter((supplier) => supplier.isActive).length;
  const contactableSuppliers =
    summary?.contactableSuppliers ??
    suppliers.filter((supplier) => supplier.email || supplier.phoneNumber)
      .length;
  const representedCountries =
    summary?.countriesRepresented ??
    new Set(suppliers.map((supplier) => supplier.country).filter(Boolean)).size;

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
          Supply Network
        </Typography>
        <Typography variant='h4' sx={{ mt: 0.8, fontWeight: 800 }}>
          Suppliers
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
          Review the external supply network feeding your product and material
          base. This view is most useful when supplier records are active,
          reachable, and geographically understood.
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
          to='/inventory/suppliers/bulk-import'
        >
          Bulk Import Suppliers
        </Button>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingSupplier(null);
            setIsDialogOpen(true);
          }}
        >
          Add Supplier
        </Button>
      </Stack>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Suppliers'
            value={summary?.totalSuppliers ?? suppliers.length}
            icon={<BusinessOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Approved and draft supplier records in the network.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Active'
            value={activeSuppliers}
            tone='#2563eb'
            icon={<TaskAltOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Suppliers currently enabled for sourcing operations.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Contactable'
            value={contactableSuppliers}
            tone='#0f766e'
            icon={<CallOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Suppliers with phone or email information available.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Countries'
            value={representedCountries}
            tone='#7c3aed'
            icon={<PublicOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Geographic coverage available to procurement.'
          />
        </Grid>
      </Grid>
      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable
            columns={columns}
            data={suppliers}
            emptyState='No suppliers found.'
          />
        </CardContent>
      </Card>

      <EntityCrudDialog<SupplierUpsertPayload>
        open={isDialogOpen}
        title={editingSupplier ? 'Edit Supplier' : 'Create Supplier'}
        description='Save one supplier record at a time.'
        schema={schema}
        defaultValues={
          editingSupplier
            ? {
                name: editingSupplier.name,
                contactPerson: editingSupplier.contactPerson ?? '',
                email: editingSupplier.email ?? '',
                phoneNumber: editingSupplier.phoneNumber ?? '',
                addressLine1: editingSupplier.addressLine1 ?? '',
                addressLine2: editingSupplier.addressLine2 ?? '',
                city: editingSupplier.city ?? '',
                stateOrProvince: editingSupplier.stateOrProvince ?? '',
                postalCode: editingSupplier.postalCode ?? '',
                country: editingSupplier.country ?? '',
                isActive: editingSupplier.isActive,
                notes: editingSupplier.notes ?? '',
              }
            : emptyValues
        }
        fields={fields}
        submitting={isSubmitting}
        submitLabel={editingSupplier ? 'Update Supplier' : 'Create Supplier'}
        onClose={() => {
          if (!isSubmitting) {
            setIsDialogOpen(false);
            setEditingSupplier(null);
          }
        }}
        onSubmit={async (values) => {
          try {
            setIsSubmitting(true);
            if (editingSupplier) {
              await inventoryApi.updateSupplier(editingSupplier.id, values);
              toast.success('Supplier updated.');
            } else {
              await inventoryApi.createSupplier(values);
              toast.success('Supplier created.');
            }
            setIsDialogOpen(false);
            setEditingSupplier(null);
            await loadData();
          } catch (submitError) {
            toast.error(
              getErrorMessage(submitError, 'Failed to save supplier.'),
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </Container>
  );
}
