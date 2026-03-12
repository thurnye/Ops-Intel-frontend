import { useEffect, useMemo, useState } from "react";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { MetricCard } from "@app/components/MetricCard";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import type { Brand, BrandMetricsSummary } from "@features/inventory/types/inventory.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

export function InventoryBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [summary, setSummary] = useState<BrandMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([inventoryApi.listBrands(), inventoryApi.getBrandsSummary()])
      .then(([brandsResponse, summaryResponse]) => {
        setBrands(getApiData(brandsResponse, []));
        setSummary(getApiData(summaryResponse, null));
      })
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load brands.")));
  }, []);

  const brandsWithDescriptions = summary?.brandsWithDescriptions ?? brands.filter((brand) => brand.description?.trim()).length;
  const descriptionCoverage = summary?.descriptionCoveragePercentage ?? (brands.length ? Math.round((brands.filter((brand) => brand.description?.trim()).length / brands.length) * 100) : 0);

  const columns = useMemo<AppDataTableColumnDef<Brand>[]>(() => [
    { accessorKey: "name", header: "Brand" },
    { accessorKey: "description", header: "Description", cell: ({ row }) => row.original.description ?? "—" }
  ], []);

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Card sx={{ border: "1px solid rgba(148, 163, 184, 0.18)", background: "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 54%, rgba(37,99,235,0.78) 100%)", color: "white" }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(191,219,254,0.92)" }}>
                Catalog Identity
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.8, fontWeight: 800 }}>
                Inventory Brands
              </Typography>
              <Typography sx={{ fontSize: 14, maxWidth: 760, color: "rgba(226,232,240,0.92)", mt: 1 }}>
                Maintain the commercial brand registry used across product catalogs. This page is strongest when brand records are descriptive enough to support merchandising, sourcing, and catalog governance.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`${descriptionCoverage}% description coverage`} sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", fontWeight: 700 }} />
              <Chip label="Catalog reference data" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
              <Chip label="Supports product positioning" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Brands" value={summary?.totalBrands ?? brands.length} icon={<LabelOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Total commercial brand entries available for catalog tagging." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="With Notes" value={brandsWithDescriptions} tone="#6366f1" icon={<NotesOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Brands carrying narrative context for planners and catalog editors." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Coverage" value={`${descriptionCoverage}%`} tone="#0f766e" icon={<PieChartOutlineOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Documentation completeness across the brand registry." />
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 2 }}>
          <AppDataTable columns={columns} data={brands} emptyState="No brands found." />
        </CardContent>
      </Card>
    </Container>
  );
}
