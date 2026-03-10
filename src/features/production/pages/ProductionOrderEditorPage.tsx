import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { RHFTextField } from "@app/components/forms/RHFTextField";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import { productionApi } from "@features/production/services/production.api.service";
import {
  ProductionPriority,
  ProductionSourceType,
  type BillOfMaterialSummary,
  type ProductionOrder,
  type ProductionOrderUpsertPayload,
  type RoutingSummary
} from "@features/production/types/production.types";
import { type ProductListItem, type UnitOfMeasure, type Warehouse } from "@features/inventory/types/inventory.types";
import { getApiData, getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";
import { toDateTimeInputValue, toUtcIso } from "@shared/utils/form.utils";

const schema = z.object({
  productionOrderNumber: z.string().min(1).max(50),
  productId: z.string().min(1, "Product is required."),
  plannedQuantity: z.coerce.number().positive("Planned quantity must be greater than 0."),
  unitOfMeasureId: z.string().min(1, "Unit of measure is required."),
  billOfMaterialId: z.string().optional(),
  routingId: z.string().optional(),
  warehouseId: z.string().min(1, "Warehouse is required."),
  plannedStartDate: z.string().min(1, "Planned start is required."),
  plannedEndDate: z.string().min(1, "Planned end is required."),
  priority: z.coerce.number().int().min(1),
  sourceType: z.coerce.number().int().min(1),
  sourceReferenceId: z.string().optional(),
  batchNumber: z.string().max(100).optional(),
  lotNumber: z.string().max(100).optional(),
  notes: z.string().max(2000).optional()
}).refine((value) => new Date(value.plannedEndDate) >= new Date(value.plannedStartDate), {
  message: "Planned end must be after planned start.",
  path: ["plannedEndDate"]
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  productionOrderNumber: "",
  productId: "",
  plannedQuantity: 1,
  unitOfMeasureId: "",
  billOfMaterialId: "",
  routingId: "",
  warehouseId: "",
  plannedStartDate: "",
  plannedEndDate: "",
  priority: ProductionPriority.Medium,
  sourceType: ProductionSourceType.Manual,
  sourceReferenceId: "",
  batchNumber: "",
  lotNumber: "",
  notes: ""
};

function toFormValues(order: ProductionOrder): FormValues {
  return {
    productionOrderNumber: order.productionOrderNumber,
    productId: order.productId,
    plannedQuantity: order.plannedQuantity,
    unitOfMeasureId: order.unitOfMeasureId,
    billOfMaterialId: "",
    routingId: "",
    warehouseId: order.warehouseId,
    plannedStartDate: toDateTimeInputValue(order.plannedStartDate),
    plannedEndDate: toDateTimeInputValue(order.plannedEndDate),
    priority: order.priority,
    sourceType: order.sourceType,
    sourceReferenceId: order.sourceReferenceId ?? "",
    batchNumber: order.batchNumber ?? "",
    lotNumber: order.lotNumber ?? "",
    notes: order.notes ?? ""
  };
}

export function ProductionOrderEditorPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(orderId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [boms, setBoms] = useState<BillOfMaterialSummary[]>([]);
  const [routings, setRoutings] = useState<RoutingSummary[]>([]);

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(isEdit);
        setError(null);

        const [productsResponse, unitsResponse, warehousesResponse, bomsResponse, routingsResponse, orderResponse] = await Promise.all([
          inventoryApi.listProducts({ pageNumber: 1, pageSize: 200 }),
          inventoryApi.listUnits(),
          inventoryApi.listWarehouses(),
          productionApi.listBillsOfMaterial({ pageNumber: 1, pageSize: 200 }),
          productionApi.listRoutings({ pageNumber: 1, pageSize: 200 }),
          orderId ? productionApi.getOrder(orderId) : Promise.resolve(null)
        ]);

        if (!active) {
          return;
        }

        setProducts(getPagedItems(productsResponse));
        setUnits(getApiData(unitsResponse, []));
        setWarehouses(getApiData(warehousesResponse, []));
        setBoms(getPagedItems(bomsResponse));
        setRoutings(getPagedItems(routingsResponse));

        if (orderResponse?.data) {
          reset(toFormValues(orderResponse.data));
        }
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError, "Failed to load production order form."));
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
  }, [isEdit, orderId, reset]);

  async function onSubmit(values: FormValues) {
    try {
      setSaving(true);
      setError(null);

      const payload: ProductionOrderUpsertPayload = {
        productionOrderNumber: values.productionOrderNumber,
        productId: values.productId,
        plannedQuantity: values.plannedQuantity,
        unitOfMeasureId: values.unitOfMeasureId,
        billOfMaterialId: values.billOfMaterialId || undefined,
        routingId: values.routingId || undefined,
        warehouseId: values.warehouseId,
        plannedStartDate: toUtcIso(values.plannedStartDate) ?? values.plannedStartDate,
        plannedEndDate: toUtcIso(values.plannedEndDate) ?? values.plannedEndDate,
        priority: values.priority,
        sourceType: values.sourceType,
        sourceReferenceId: values.sourceReferenceId || undefined,
        batchNumber: values.batchNumber || undefined,
        lotNumber: values.lotNumber || undefined,
        notes: values.notes || undefined
      };

      const response = isEdit && orderId
        ? await productionApi.updateOrder(orderId, payload)
        : await productionApi.createOrder(payload);

      toast.success(isEdit ? "Production order updated." : "Production order created.");
      navigate(`/production/${response.data?.id ?? orderId}`);
    } catch (submitError) {
      const message = getErrorMessage(submitError, "Failed to save production order.");
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
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to={isEdit && orderId ? `/production/${orderId}` : "/production"}>
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back
        </RouterLink>
        <Typography variant="h4" mt={1}>{isEdit ? "Edit Production Order" : "Create Production Order"}</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Capture the manufacturing order inputs that drive planning, routing, and execution.
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Order Setup</Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="productionOrderNumber" label="Order Number" size="small" fullWidth disabled={isEdit} />
                  <RHFSelectField control={control} name="productId" label="Product" size="small" fullWidth options={products.map((product) => ({ value: product.id, label: `${product.name} (${product.sku})` }))} />
                  <RHFSelectField control={control} name="unitOfMeasureId" label="Unit" size="small" fullWidth options={units.map((unit) => ({ value: unit.id, label: `${unit.name} (${unit.symbol})` }))} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="plannedQuantity" label="Planned Quantity" type="number" size="small" fullWidth />
                  <RHFSelectField control={control} name="warehouseId" label="Warehouse" size="small" fullWidth options={warehouses.map((warehouse) => ({ value: warehouse.id, label: warehouse.name }))} />
                  <RHFSelectField
                    control={control}
                    name="priority"
                    label="Priority"
                    size="small"
                    fullWidth
                    options={[
                      { value: ProductionPriority.Low, label: "Low" },
                      { value: ProductionPriority.Medium, label: "Medium" },
                      { value: ProductionPriority.High, label: "High" },
                      { value: ProductionPriority.Urgent, label: "Urgent" }
                    ]}
                  />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFSelectField
                    control={control}
                    name="sourceType"
                    label="Source Type"
                    size="small"
                    fullWidth
                    disabled={isEdit}
                    options={[
                      { value: ProductionSourceType.Manual, label: "Manual" },
                      { value: ProductionSourceType.SalesOrder, label: "Sales Order" },
                      { value: ProductionSourceType.Replenishment, label: "Replenishment" },
                      { value: ProductionSourceType.Forecast, label: "Forecast" },
                      { value: ProductionSourceType.TransferDemand, label: "Transfer Demand" }
                    ]}
                  />
                  <RHFTextField control={control} name="sourceReferenceId" label="Source Reference Id" size="small" fullWidth disabled={isEdit} />
                  <RHFSelectField control={control} name="billOfMaterialId" label="Bill of Material" size="small" fullWidth options={[{ value: "", label: "No BOM" }, ...boms.map((bom) => ({ value: bom.id, label: `${bom.bomCode} - ${bom.name}` }))]} />
                </Stack>
                <RHFSelectField control={control} name="routingId" label="Routing" size="small" fullWidth options={[{ value: "", label: "No routing" }, ...routings.map((routing) => ({ value: routing.id, label: `${routing.routingCode} - ${routing.name}` }))]} />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Timing & Traceability</Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="plannedStartDate" label="Planned Start" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <RHFTextField control={control} name="plannedEndDate" label="Planned End" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="batchNumber" label="Batch Number" size="small" fullWidth />
                  <RHFTextField control={control} name="lotNumber" label="Lot Number" size="small" fullWidth />
                </Stack>
                <RHFTextField control={control} name="notes" label="Notes" size="small" fullWidth multiline rows={4} />
              </Stack>
            </CardContent>
          </Card>

          <Stack direction="row" spacing={1.5}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Production Order"}
            </Button>
            <Button variant="outlined" onClick={() => reset(defaultValues)} disabled={saving || isEdit}>Reset</Button>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
}
