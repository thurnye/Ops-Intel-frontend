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
import { schedulingApi } from "@features/scheduling/services/scheduling.api.service";
import { ScheduleGenerationMode, SchedulingStrategy, type SchedulePlanDetail, type SchedulePlanUpsertPayload } from "@features/scheduling/types/scheduling.types";
import { type Warehouse } from "@features/inventory/types/inventory.types";
import { getApiData, getErrorMessage } from "@shared/utils/asyncThunk.utils";
import { toDateTimeInputValue, toUtcIso } from "@shared/utils/form.utils";

const schema = z.object({
  planNumber: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  warehouseId: z.string().min(1, "Warehouse is required."),
  planningStartDateUtc: z.string().min(1),
  planningEndDateUtc: z.string().min(1),
  generationMode: z.coerce.number().int().min(1).max(3),
  schedulingStrategy: z.coerce.number().int().min(1).max(5),
  autoSequenceEnabled: z.boolean(),
  autoDispatchEnabled: z.boolean(),
  timeZone: z.string().min(1).max(100),
  isActive: z.boolean()
}).refine((value) => new Date(value.planningEndDateUtc) >= new Date(value.planningStartDateUtc), {
  message: "Planning end must be after planning start.",
  path: ["planningEndDateUtc"]
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  planNumber: "",
  name: "",
  description: "",
  warehouseId: "",
  planningStartDateUtc: "",
  planningEndDateUtc: "",
  generationMode: ScheduleGenerationMode.Manual,
  schedulingStrategy: SchedulingStrategy.Forward,
  autoSequenceEnabled: true,
  autoDispatchEnabled: false,
  timeZone: "UTC",
  isActive: true
};

function toFormValues(plan: SchedulePlanDetail): FormValues {
  return {
    planNumber: plan.planNumber,
    name: plan.name,
    description: plan.description ?? "",
    warehouseId: plan.warehouseId,
    planningStartDateUtc: toDateTimeInputValue(plan.planningStartDateUtc),
    planningEndDateUtc: toDateTimeInputValue(plan.planningEndDateUtc),
    generationMode: plan.generationMode,
    schedulingStrategy: plan.schedulingStrategy,
    autoSequenceEnabled: plan.autoSequenceEnabled,
    autoDispatchEnabled: plan.autoDispatchEnabled,
    timeZone: plan.timeZone,
    isActive: plan.isActive
  };
}

export function SchedulePlanEditorPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(planId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        const [warehousesResponse, planResponse] = await Promise.all([
          inventoryApi.listWarehouses(),
          planId ? schedulingApi.getPlan(planId) : Promise.resolve(null)
        ]);

        if (!active) {
          return;
        }

        setWarehouses(getApiData(warehousesResponse, []));
        if (planResponse?.data) {
          reset(toFormValues(planResponse.data));
        }
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError, "Failed to load schedule plan form."));
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
  }, [isEdit, planId, reset]);

  async function onSubmit(values: FormValues) {
    try {
      setSaving(true);
      const payload: SchedulePlanUpsertPayload = {
        planNumber: values.planNumber,
        name: values.name,
        description: values.description || undefined,
        warehouseId: values.warehouseId,
        planningStartDateUtc: toUtcIso(values.planningStartDateUtc) ?? values.planningStartDateUtc,
        planningEndDateUtc: toUtcIso(values.planningEndDateUtc) ?? values.planningEndDateUtc,
        generationMode: values.generationMode,
        schedulingStrategy: values.schedulingStrategy,
        autoSequenceEnabled: values.autoSequenceEnabled,
        autoDispatchEnabled: values.autoDispatchEnabled,
        timeZone: values.timeZone,
        isActive: values.isActive
      };

      const response = isEdit && planId
        ? await schedulingApi.updatePlan(planId, payload)
        : await schedulingApi.createPlan(payload);

      toast.success(isEdit ? "Schedule plan updated." : "Schedule plan created.");
      navigate(`/scheduling/plans/${response.data?.id ?? planId}`);
    } catch (submitError) {
      const message = getErrorMessage(submitError, "Failed to save schedule plan.");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!planId) {
      return;
    }

    try {
      setDeleting(true);
      await schedulingApi.deletePlan(planId);
      toast.success("Schedule plan deleted.");
      navigate("/scheduling");
    } catch (deleteError) {
      const message = getErrorMessage(deleteError, "Failed to delete schedule plan.");
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
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to={isEdit && planId ? `/scheduling/plans/${planId}` : "/scheduling"}>
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back
        </RouterLink>
        <Typography variant="h4" mt={1}>{isEdit ? "Edit Schedule Plan" : "Create Schedule Plan"}</Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="planNumber" label="Plan Number" size="small" fullWidth disabled={isEdit} />
                  <RHFTextField control={control} name="name" label="Name" size="small" fullWidth />
                  <RHFSelectField control={control} name="warehouseId" label="Warehouse" size="small" fullWidth options={warehouses.map((warehouse) => ({ value: warehouse.id, label: warehouse.name }))} disabled={isEdit} />
                </Stack>
                <RHFTextField control={control} name="description" label="Description" size="small" fullWidth multiline rows={3} />
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="planningStartDateUtc" label="Planning Start" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <RHFTextField control={control} name="planningEndDateUtc" label="Planning End" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFSelectField control={control} name="generationMode" label="Generation Mode" size="small" fullWidth options={[{ value: ScheduleGenerationMode.Manual, label: "Manual" }, { value: ScheduleGenerationMode.SemiAutomatic, label: "Semi-automatic" }, { value: ScheduleGenerationMode.Automatic, label: "Automatic" }]} />
                  <RHFSelectField control={control} name="schedulingStrategy" label="Scheduling Strategy" size="small" fullWidth options={[{ value: SchedulingStrategy.Forward, label: "Forward" }, { value: SchedulingStrategy.Backward, label: "Backward" }, { value: SchedulingStrategy.FiniteCapacity, label: "Finite Capacity" }, { value: SchedulingStrategy.InfiniteCapacity, label: "Infinite Capacity" }, { value: SchedulingStrategy.ConstraintBased, label: "Constraint Based" }]} />
                  <RHFTextField control={control} name="timeZone" label="Time Zone" size="small" fullWidth />
                </Stack>
                <RHFSwitchField control={control} name="autoSequenceEnabled" label="Auto-sequence operations" />
                <RHFSwitchField control={control} name="autoDispatchEnabled" label="Auto-dispatch operations" />
                {isEdit ? <RHFSwitchField control={control} name="isActive" label="Plan is active" /> : null}
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
            <Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : isEdit ? "Save Changes" : "Create Plan"}</Button>
            {isEdit ? <Button color="error" variant="outlined" onClick={() => setDeleteOpen(true)}>Delete Plan</Button> : null}
          </Stack>
        </Stack>
      </form>

      <ConfirmActionDialog
        open={deleteOpen}
        title="Delete schedule plan?"
        description="This removes the plan and its high-level schedule record."
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
        loading={deleting}
      />
    </Container>
  );
}
