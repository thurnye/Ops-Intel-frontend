import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { RHFSelectField } from "@app/components/forms/RHFSelectField";
import { RHFSwitchField } from "@app/components/forms/RHFSwitchField";
import { RHFTextField } from "@app/components/forms/RHFTextField";
import { productFormDefaultValues, productFormSchema, type ProductFormValues } from "@features/inventory/config/productForm.config";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import { ProductStatus, type Brand, type Category, type Product, type ProductUpsertPayload, type UnitOfMeasure } from "@features/inventory/types/inventory.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";

function toFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    description: product.description ?? "",
    sku: product.sku,
    barcode: product.barcode ?? "",
    categoryId: product.categoryId,
    brandId: product.brandId ?? "",
    unitOfMeasureId: product.unitOfMeasureId,
    costPrice: product.costPrice,
    sellingPrice: product.sellingPrice,
    taxRate: product.taxRate,
    reorderLevel: product.reorderLevel,
    reorderQuantity: product.reorderQuantity,
    trackInventory: product.trackInventory,
    allowBackOrder: product.allowBackOrder,
    isSerialized: product.isSerialized,
    isBatchTracked: product.isBatchTracked,
    isPerishable: product.isPerishable,
    weight: product.weight,
    length: product.length,
    width: product.width,
    height: product.height,
    status: product.status,
    thumbnailImageUrl: product.thumbnailImageUrl ?? ""
  };
}

export function InventoryItemEditorPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(itemId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);

  const form = useForm<any>({
    resolver: zodResolver(productFormSchema),
    defaultValues: productFormDefaultValues
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(isEdit);
        setError(null);

        const [categoriesResponse, brandsResponse, unitsResponse, productResponse] = await Promise.all([
          inventoryApi.listCategories(),
          inventoryApi.listBrands(),
          inventoryApi.listUnits(),
          itemId ? inventoryApi.getProduct(itemId) : Promise.resolve(null)
        ]);

        if (!active) {
          return;
        }

        setCategories(getApiData(categoriesResponse, []));
        setBrands(getApiData(brandsResponse, []));
        setUnits(getApiData(unitsResponse, []));

        if (productResponse?.data) {
          reset(toFormValues(productResponse.data));
        }
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError, "Failed to load product form."));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [isEdit, itemId, reset]);

  async function onSubmit(values: ProductFormValues) {
    try {
      setSaving(true);
      setError(null);

      const payload: ProductUpsertPayload = {
        id: itemId,
        ...values,
        brandId: values.brandId || undefined,
        description: values.description || undefined,
        barcode: values.barcode || undefined,
        thumbnailImageUrl: values.thumbnailImageUrl || undefined
      };

      const response = isEdit && itemId
        ? await inventoryApi.updateProduct(itemId, payload)
        : await inventoryApi.createProduct(payload);

      toast.success(isEdit ? "Product updated." : "Product created.");
      navigate(`/inventory/${response.data?.id ?? itemId}`);
    } catch (submitError) {
      const message = getErrorMessage(submitError, "Failed to save product.");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Container maxWidth={false} disableGutters>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 320 }}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Box>
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to={isEdit && itemId ? `/inventory/${itemId}` : "/inventory"}>
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back
        </RouterLink>
        <Typography variant="h4" mt={1}>{isEdit ? "Edit Product" : "Create Product"}</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Define the commercial, inventory, and dimensional data used across operations.
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Product Basics</Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="name" label="Name" size="small" fullWidth />
                  <RHFTextField control={control} name="sku" label="SKU" size="small" fullWidth />
                  <RHFTextField control={control} name="barcode" label="Barcode" size="small" fullWidth />
                </Stack>
                <RHFTextField control={control} name="description" label="Description" size="small" fullWidth multiline rows={4} />
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFSelectField control={control} name="categoryId" label="Category" size="small" fullWidth options={categories.map((category) => ({ value: category.id, label: category.name }))} />
                  <RHFSelectField control={control} name="brandId" label="Brand" size="small" fullWidth options={[{ value: "", label: "No brand" }, ...brands.map((brand) => ({ value: brand.id, label: brand.name }))]} />
                  <RHFSelectField control={control} name="unitOfMeasureId" label="Unit" size="small" fullWidth options={units.map((unit) => ({ value: unit.id, label: `${unit.name} (${unit.symbol})` }))} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Pricing & Thresholds</Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="costPrice" label="Cost Price" type="number" size="small" fullWidth />
                  <RHFTextField control={control} name="sellingPrice" label="Selling Price" type="number" size="small" fullWidth />
                  <RHFTextField control={control} name="taxRate" label="Tax Rate" type="number" size="small" fullWidth />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="reorderLevel" label="Reorder Level" type="number" size="small" fullWidth />
                  <RHFTextField control={control} name="reorderQuantity" label="Reorder Quantity" type="number" size="small" fullWidth />
                  <RHFSelectField
                    control={control}
                    name="status"
                    label="Status"
                    size="small"
                    fullWidth
                    options={[
                      { value: ProductStatus.Draft, label: "Draft" },
                      { value: ProductStatus.Active, label: "Active" },
                      { value: ProductStatus.Inactive, label: "Inactive" },
                      { value: ProductStatus.Discontinued, label: "Discontinued" }
                    ]}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Physical Attributes</Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="weight" label="Weight" type="number" size="small" fullWidth />
                  <RHFTextField control={control} name="length" label="Length" type="number" size="small" fullWidth />
                  <RHFTextField control={control} name="width" label="Width" type="number" size="small" fullWidth />
                  <RHFTextField control={control} name="height" label="Height" type="number" size="small" fullWidth />
                </Stack>
                <RHFTextField control={control} name="thumbnailImageUrl" label="Thumbnail URL" size="small" fullWidth />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="h6">Inventory Behavior</Typography>
                <RHFSwitchField control={control} name="trackInventory" label="Track inventory movements" />
                <RHFSwitchField control={control} name="allowBackOrder" label="Allow backorders" />
                <RHFSwitchField control={control} name="isSerialized" label="Serialized tracking" />
                <RHFSwitchField control={control} name="isBatchTracked" label="Batch tracking" />
                <RHFSwitchField control={control} name="isPerishable" label="Perishable product" />
              </Stack>
            </CardContent>
          </Card>

          <Stack direction="row" spacing={1.5}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </Button>
            <Button variant="outlined" onClick={() => reset(productFormDefaultValues)} disabled={saving || isEdit}>Reset</Button>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
}
