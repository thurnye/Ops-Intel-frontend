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
import { RHFSwitchField } from "@app/components/forms/RHFSwitchField";
import { RHFTextField } from "@app/components/forms/RHFTextField";
import { ConfirmActionDialog } from "@app/components/ConfirmActionDialog";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import { ordersApi } from "@features/orders/services/orders.api.service";
import { productionApi } from "@features/production/services/production.api.service";
import { schedulingApi } from "@features/scheduling/services/scheduling.api.service";
import { SchedulePriority, type ScheduleJobDetail, type ScheduleJobUpsertPayload, type SchedulePlan } from "@features/scheduling/types/scheduling.types";
import { type ProductListItem, type Warehouse } from "@features/inventory/types/inventory.types";
import { type OrderListItem } from "@features/orders/types/orders.types";
import { type ProductionOrderSummary } from "@features/production/types/production.types";
import { getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";
import { toDateTimeInputValue, toUtcIso } from "@shared/utils/form.utils";

const schema = z.object({
  schedulePlanId: z.string().min(1, "Schedule plan is required."),
  productionOrderId: z.string().min(1, "Production order is required."),
  orderId: z.string().optional(),
  orderItemId: z.string().optional(),
  productId: z.string().min(1, "Product is required."),
  warehouseId: z.string().min(1, "Warehouse is required."),
  jobNumber: z.string().min(1).max(50),
  jobName: z.string().min(1).max(200),
  notes: z.string().max(2000).optional(),
  plannedQuantity: z.coerce.number().positive("Planned quantity must be greater than 0."),
  earliestStartUtc: z.string().optional(),
  latestFinishUtc: z.string().optional(),
  dueDateUtc: z.string().optional(),
  priority: z.coerce.number().int().min(1).max(5),
  isRushOrder: z.boolean(),
  qualityHold: z.boolean()
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  schedulePlanId: "",
  productionOrderId: "",
  orderId: "",
  orderItemId: "",
  productId: "",
  warehouseId: "",
  jobNumber: "",
  jobName: "",
  notes: "",
  plannedQuantity: 1,
  earliestStartUtc: "",
  latestFinishUtc: "",
  dueDateUtc: "",
  priority: SchedulePriority.Normal,
  isRushOrder: false,
  qualityHold: false
};

function toFormValues(job: ScheduleJobDetail): FormValues {
  return {
    schedulePlanId: job.schedulePlanId,
    productionOrderId: job.productionOrderId,
    orderId: job.orderId ?? "",
    orderItemId: "",
    productId: job.productId,
    warehouseId: job.warehouseId,
    jobNumber: job.jobNumber,
    jobName: job.jobName,
    notes: "",
    plannedQuantity: job.plannedQuantity,
    earliestStartUtc: toDateTimeInputValue(job.plannedStartUtc),
    latestFinishUtc: toDateTimeInputValue(job.plannedEndUtc),
    dueDateUtc: toDateTimeInputValue(job.dueDateUtc),
    priority: job.priority,
    isRushOrder: false,
    qualityHold: false
  };
}

export function ScheduleJobEditorPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(jobId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<SchedulePlan[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrderSummary[]>([]);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

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
        const [plansResponse, productionOrdersResponse, ordersResponse, productsResponse, warehousesResponse, jobResponse] = await Promise.all([
          schedulingApi.listPlans({ pageNumber: 1, pageSize: 200 }),
          productionApi.listOrders({ pageNumber: 1, pageSize: 200 }),
          ordersApi.listOrders({ pageNumber: 1, pageSize: 200 }),
          inventoryApi.listProducts({ pageNumber: 1, pageSize: 200 }),
          inventoryApi.listWarehouses(),
          jobId ? schedulingApi.getJob(jobId) : Promise.resolve(null)
        ]);

        if (!active) {
          return;
        }

        setPlans(getPagedItems(plansResponse));
        setProductionOrders(getPagedItems(productionOrdersResponse));
        setOrders(getPagedItems(ordersResponse));
        setProducts(getPagedItems(productsResponse));
        setWarehouses((warehousesResponse.data ?? []));

        if (jobResponse?.data) {
          reset(toFormValues(jobResponse.data));
        }
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError, "Failed to load schedule job form."));
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
  }, [isEdit, jobId, reset]);

  async function onSubmit(values: FormValues) {
    try {
      setSaving(true);
      const payload: ScheduleJobUpsertPayload = {
        schedulePlanId: values.schedulePlanId,
        productionOrderId: values.productionOrderId,
        orderId: values.orderId || undefined,
        orderItemId: values.orderItemId || undefined,
        productId: values.productId,
        warehouseId: values.warehouseId,
        jobNumber: values.jobNumber,
        jobName: values.jobName,
        notes: values.notes || undefined,
        plannedQuantity: values.plannedQuantity,
        earliestStartUtc: toUtcIso(values.earliestStartUtc),
        latestFinishUtc: toUtcIso(values.latestFinishUtc),
        dueDateUtc: toUtcIso(values.dueDateUtc),
        priority: values.priority,
        isRushOrder: values.isRushOrder,
        qualityHold: values.qualityHold
      };

      const response = isEdit && jobId
        ? await schedulingApi.updateJob(jobId, payload)
        : await schedulingApi.createJob(payload);

      toast.success(isEdit ? "Schedule job updated." : "Schedule job created.");
      navigate(`/scheduling/jobs/${response.data?.id ?? jobId}`);
    } catch (submitError) {
      const message = getErrorMessage(submitError, "Failed to save schedule job.");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!jobId) {
      return;
    }

    try {
      setDeleting(true);
      await schedulingApi.deleteJob(jobId);
      toast.success("Schedule job deleted.");
      navigate("/scheduling");
    } catch (deleteError) {
      const message = getErrorMessage(deleteError, "Failed to delete schedule job.");
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
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
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to={isEdit && jobId ? `/scheduling/jobs/${jobId}` : "/scheduling"}>
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back
        </RouterLink>
        <Typography variant="h4" mt={1}>{isEdit ? "Edit Schedule Job" : "Create Schedule Job"}</Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFSelectField control={control} name="schedulePlanId" label="Schedule Plan" size="small" fullWidth options={plans.map((plan) => ({ value: plan.id, label: `${plan.planNumber} - ${plan.name}` }))} disabled={isEdit} />
                  <RHFSelectField control={control} name="productionOrderId" label="Production Order" size="small" fullWidth options={productionOrders.map((order) => ({ value: order.id, label: order.productionOrderNumber }))} disabled={isEdit} />
                  <RHFSelectField control={control} name="orderId" label="Order" size="small" fullWidth options={[{ value: "", label: "No linked order" }, ...orders.map((order) => ({ value: order.id, label: order.orderNumber }))]} disabled={isEdit} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFSelectField control={control} name="productId" label="Product" size="small" fullWidth options={products.map((product) => ({ value: product.id, label: `${product.name} (${product.sku})` }))} disabled={isEdit} />
                  <RHFSelectField control={control} name="warehouseId" label="Warehouse" size="small" fullWidth options={warehouses.map((warehouse) => ({ value: warehouse.id, label: warehouse.name }))} disabled={isEdit} />
                  <RHFTextField control={control} name="jobNumber" label="Job Number" size="small" fullWidth disabled={isEdit} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="jobName" label="Job Name" size="small" fullWidth />
                  <RHFTextField control={control} name="plannedQuantity" label="Planned Quantity" type="number" size="small" fullWidth />
                  <RHFSelectField control={control} name="priority" label="Priority" size="small" fullWidth options={[{ value: SchedulePriority.Low, label: "Low" }, { value: SchedulePriority.Normal, label: "Normal" }, { value: SchedulePriority.High, label: "High" }, { value: SchedulePriority.Urgent, label: "Urgent" }, { value: SchedulePriority.Critical, label: "Critical" }]} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="earliestStartUtc" label="Earliest Start" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <RHFTextField control={control} name="latestFinishUtc" label="Latest Finish" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <RHFTextField control={control} name="dueDateUtc" label="Due Date" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                </Stack>
                <RHFTextField control={control} name="notes" label="Notes" size="small" fullWidth multiline rows={4} />
                <RHFSwitchField control={control} name="isRushOrder" label="Rush order" />
                <RHFSwitchField control={control} name="qualityHold" label="Quality hold" />
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
            <Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : isEdit ? "Save Changes" : "Create Job"}</Button>
            {isEdit ? <Button color="error" variant="outlined" onClick={() => setDeleteOpen(true)}>Delete Job</Button> : null}
          </Stack>
        </Stack>
      </form>

      <ConfirmActionDialog
        open={deleteOpen}
        title="Delete schedule job?"
        description="This removes the job from the scheduling queue."
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
        loading={deleting}
      />
    </Container>
  );
}
