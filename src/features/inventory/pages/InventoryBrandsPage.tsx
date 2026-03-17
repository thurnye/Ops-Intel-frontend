import { useEffect, useMemo, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
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
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import type { AppDataTableColumnDef } from '@app/components/AppDataTable';
import { AppDataTable } from '@app/components/AppDataTable';
import { MetricCard } from '@app/components/MetricCard';
import {
  EntityCrudDialog,
  type EntityFieldConfig,
} from '@app/components/forms/EntityCrudDialog';
import { inventoryApi } from '@features/inventory/services/inventory.api.service';
import type {
  Brand,
  BrandMetricsSummary,
  BrandUpsertPayload,
} from '@features/inventory/types/inventory.types';
import { getApiData, getErrorMessage } from '@shared/utils/asyncThunk.utils';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().trim().min(2, 'Brand name is required.'),
  description: z.string().optional(),
});

const fields: EntityFieldConfig[] = [
  { name: 'name', label: 'Brand Name' },
  { name: 'description', label: 'Description', kind: 'multiline' },
];

const emptyValues: BrandUpsertPayload = {
  name: '',
  description: '',
};

export function InventoryBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [summary, setSummary] = useState<BrandMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    await Promise.all([
      inventoryApi.listBrands(),
      inventoryApi.getBrandsSummary(),
    ])
      .then(([brandsResponse, summaryResponse]) => {
        setBrands(getApiData(brandsResponse, []));
        setSummary(getApiData(summaryResponse, null));
      })
      .catch((loadError) =>
        setError(getErrorMessage(loadError, 'Failed to load brands.')),
      );
  }

  useEffect(() => {
    void loadData();
  }, []);

  const brandsWithDescriptions =
    summary?.brandsWithDescriptions ??
    brands.filter((brand) => brand.description?.trim()).length;
  const descriptionCoverage =
    summary?.descriptionCoveragePercentage ??
    (brands.length
      ? Math.round(
          (brands.filter((brand) => brand.description?.trim()).length /
            brands.length) *
            100,
        )
      : 0);

  const columns = useMemo<AppDataTableColumnDef<Brand>[]>(
    () => [
      { accessorKey: 'name', header: 'Brand' },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => row.original.description ?? '—',
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
              setEditingBrand(row.original);
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
          Catalog Identity
        </Typography>
        <Typography variant='h4' sx={{ mt: 0.8, fontWeight: 800 }}>
          Inventory Brands
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
          Maintain the commercial brand registry used across product catalogs.
          This page is strongest when brand records are descriptive enough to
          support merchandising, sourcing, and catalog governance.
        </Typography>
      </Box>

      {error ? <Alert severity='error'>{error}</Alert> : null}

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        justifyContent='flex-end'
      >
        <Button
          component={RouterLink}
          to='/inventory/brands/bulk-import'
          variant='outlined'
          startIcon={<PlaylistAddOutlinedIcon />}
        >
          Bulk Import Brands
        </Button>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingBrand(null);
            setIsDialogOpen(true);
          }}
        >
          Add Brand
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Brands'
            value={summary?.totalBrands ?? brands.length}
            icon={<LabelOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Total commercial brand entries available for catalog tagging.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='With Notes'
            value={brandsWithDescriptions}
            tone='#6366f1'
            icon={<NotesOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Brands carrying narrative context for planners and catalog editors.'
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard
            label='Coverage'
            value={`${descriptionCoverage}%`}
            tone='#0f766e'
            icon={<PieChartOutlineOutlinedIcon sx={{ fontSize: 18 }} />}
            helpText='Documentation completeness across the brand registry.'
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable
            columns={columns}
            data={brands}
            emptyState='No brands found.'
          />
        </CardContent>
      </Card>

      <EntityCrudDialog<BrandUpsertPayload>
        open={isDialogOpen}
        title={editingBrand ? 'Edit Brand' : 'Create Brand'}
        description='Save one catalog brand record at a time.'
        schema={schema}
        defaultValues={
          editingBrand
            ? {
                name: editingBrand.name,
                description: editingBrand.description ?? '',
              }
            : emptyValues
        }
        fields={fields}
        submitting={isSubmitting}
        submitLabel={editingBrand ? 'Update Brand' : 'Create Brand'}
        onClose={() => {
          if (!isSubmitting) {
            setIsDialogOpen(false);
            setEditingBrand(null);
          }
        }}
        onSubmit={async (values) => {
          try {
            setIsSubmitting(true);
            if (editingBrand) {
              await inventoryApi.updateBrand(editingBrand.id, values);
              toast.success('Brand updated.');
            } else {
              await inventoryApi.createBrand(values);
              toast.success('Brand created.');
            }
            setIsDialogOpen(false);
            setEditingBrand(null);
            await loadData();
          } catch (submitError) {
            toast.error(getErrorMessage(submitError, 'Failed to save brand.'));
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </Container>
  );
}
