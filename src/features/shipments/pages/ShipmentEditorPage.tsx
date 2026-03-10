import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { shipmentsApi } from "@features/shipments/services/shipments.api.service";
import {
  ShipmentPriority,
  ShipmentType,
  type Carrier,
  type CarrierService,
  type Shipment,
  type ShipmentAddress,
  type ShipmentUpsertPayload
} from "@features/shipments/types/shipments.types";
import { type Warehouse } from "@features/inventory/types/inventory.types";
import { type OrderListItem } from "@features/orders/types/orders.types";
import { getApiData, getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";
import { toDateTimeInputValue, toUtcIso } from "@shared/utils/form.utils";

const schema = z.object({
  orderId: z.string().optional(),
  warehouseId: z.string().min(1, "Warehouse is required."),
  originAddressId: z.string().min(1, "Origin address is required."),
  destinationAddressId: z.string().min(1, "Destination address is required."),
  carrierId: z.string().optional(),
  carrierServiceId: z.string().optional(),
  type: z.coerce.number().int().min(1),
  priority: z.coerce.number().int().min(1),
  customerReference: z.string().max(100).optional(),
  externalReference: z.string().max(100).optional(),
  trackingNumber: z.string().max(100).optional(),
  masterTrackingNumber: z.string().max(100).optional(),
  plannedShipDateUtc: z.string().optional(),
  plannedDeliveryDateUtc: z.string().optional(),
  scheduledPickupStartUtc: z.string().optional(),
  scheduledPickupEndUtc: z.string().optional(),
  isPartialShipment: z.boolean(),
  requiresSignature: z.boolean(),
  isFragile: z.boolean(),
  isHazardous: z.boolean(),
  isTemperatureControlled: z.boolean(),
  isInsured: z.boolean(),
  isCrossBorder: z.boolean(),
  currencyCode: z.string().min(1).max(10),
  shippingTerms: z.string().max(100).optional(),
  incoterm: z.string().max(50).optional(),
  notes: z.string().max(1000).optional(),
  internalNotes: z.string().max(1000).optional()
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  orderId: "",
  warehouseId: "",
  originAddressId: "",
  destinationAddressId: "",
  carrierId: "",
  carrierServiceId: "",
  type: ShipmentType.Outbound,
  priority: ShipmentPriority.Normal,
  customerReference: "",
  externalReference: "",
  trackingNumber: "",
  masterTrackingNumber: "",
  plannedShipDateUtc: "",
  plannedDeliveryDateUtc: "",
  scheduledPickupStartUtc: "",
  scheduledPickupEndUtc: "",
  isPartialShipment: false,
  requiresSignature: false,
  isFragile: false,
  isHazardous: false,
  isTemperatureControlled: false,
  isInsured: false,
  isCrossBorder: false,
  currencyCode: "CAD",
  shippingTerms: "",
  incoterm: "",
  notes: "",
  internalNotes: ""
};

function toFormValues(shipment: Shipment): FormValues {
  return {
    orderId: shipment.orderId ?? "",
    warehouseId: shipment.warehouseId,
    originAddressId: shipment.originAddress.id,
    destinationAddressId: shipment.destinationAddress.id,
    carrierId: shipment.carrierId ?? "",
    carrierServiceId: shipment.carrierServiceId ?? "",
    type: shipment.type,
    priority: shipment.priority,
    customerReference: shipment.customerReference ?? "",
    externalReference: shipment.externalReference ?? "",
    trackingNumber: shipment.trackingNumber ?? "",
    masterTrackingNumber: shipment.masterTrackingNumber ?? "",
    plannedShipDateUtc: toDateTimeInputValue(shipment.plannedShipDateUtc),
    plannedDeliveryDateUtc: toDateTimeInputValue(shipment.plannedDeliveryDateUtc),
    scheduledPickupStartUtc: toDateTimeInputValue(shipment.scheduledPickupStartUtc),
    scheduledPickupEndUtc: toDateTimeInputValue(shipment.scheduledPickupEndUtc),
    isPartialShipment: shipment.isPartialShipment,
    requiresSignature: shipment.requiresSignature,
    isFragile: shipment.isFragile,
    isHazardous: shipment.isHazardous,
    isTemperatureControlled: shipment.isTemperatureControlled,
    isInsured: shipment.isInsured,
    isCrossBorder: shipment.isCrossBorder,
    currencyCode: shipment.currencyCode,
    shippingTerms: shipment.shippingTerms ?? "",
    incoterm: shipment.incoterm ?? "",
    notes: shipment.notes ?? "",
    internalNotes: shipment.internalNotes ?? ""
  };
}

export function ShipmentEditorPage() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(shipmentId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [addresses, setAddresses] = useState<ShipmentAddress[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [carrierServices, setCarrierServices] = useState<CarrierService[]>([]);

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const { control, handleSubmit, reset, setValue } = form;
  const selectedCarrierId = useWatch({ control, name: "carrierId" });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(isEdit);
        const [ordersResponse, warehousesResponse, addressesResponse, carriersResponse, shipmentResponse] = await Promise.all([
          ordersApi.listOrders({ pageNumber: 1, pageSize: 200 }),
          inventoryApi.listWarehouses(),
          shipmentsApi.searchAddresses({ take: 100 }),
          shipmentsApi.listCarriers({ pageNumber: 1, pageSize: 100, isActive: true }),
          shipmentId ? shipmentsApi.getShipment(shipmentId) : Promise.resolve(null)
        ]);

        if (!active) {
          return;
        }

        setOrders(getPagedItems(ordersResponse));
        setWarehouses(getApiData(warehousesResponse, []));
        setAddresses(getApiData(addressesResponse, []));
        setCarriers(getPagedItems(carriersResponse));

        if (shipmentResponse?.data) {
          reset(toFormValues(shipmentResponse.data));
        }
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError, "Failed to load shipment form."));
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
  }, [isEdit, shipmentId, reset]);

  useEffect(() => {
    let active = true;

    async function loadCarrierServices() {
      if (!selectedCarrierId) {
        setCarrierServices([]);
        setValue("carrierServiceId", "");
        return;
      }

      try {
        const response = await shipmentsApi.listCarrierServices(selectedCarrierId, { isActive: true });
        if (active) {
          setCarrierServices(getApiData(response, []));
        }
      } catch {
        if (active) {
          setCarrierServices([]);
        }
      }
    }

    void loadCarrierServices();
    return () => {
      active = false;
    };
  }, [selectedCarrierId, setValue]);

  async function onSubmit(values: FormValues) {
    try {
      setSaving(true);
      const payload: ShipmentUpsertPayload = {
        orderId: values.orderId || undefined,
        warehouseId: values.warehouseId,
        originAddressId: values.originAddressId,
        destinationAddressId: values.destinationAddressId,
        carrierId: values.carrierId || undefined,
        carrierServiceId: values.carrierServiceId || undefined,
        type: values.type,
        priority: values.priority,
        customerReference: values.customerReference || undefined,
        externalReference: values.externalReference || undefined,
        trackingNumber: values.trackingNumber || undefined,
        masterTrackingNumber: values.masterTrackingNumber || undefined,
        plannedShipDateUtc: toUtcIso(values.plannedShipDateUtc),
        plannedDeliveryDateUtc: toUtcIso(values.plannedDeliveryDateUtc),
        scheduledPickupStartUtc: toUtcIso(values.scheduledPickupStartUtc),
        scheduledPickupEndUtc: toUtcIso(values.scheduledPickupEndUtc),
        isPartialShipment: values.isPartialShipment,
        requiresSignature: values.requiresSignature,
        isFragile: values.isFragile,
        isHazardous: values.isHazardous,
        isTemperatureControlled: values.isTemperatureControlled,
        isInsured: values.isInsured,
        isCrossBorder: values.isCrossBorder,
        currencyCode: values.currencyCode,
        shippingTerms: values.shippingTerms || undefined,
        incoterm: values.incoterm || undefined,
        notes: values.notes || undefined,
        internalNotes: values.internalNotes || undefined
      };

      const response = isEdit && shipmentId
        ? await shipmentsApi.updateShipment(shipmentId, payload)
        : await shipmentsApi.createShipment(payload);

      toast.success(isEdit ? "Shipment updated." : "Shipment created.");
      navigate(`/shipments/${response.data?.id ?? shipmentId}`);
    } catch (submitError) {
      const message = getErrorMessage(submitError, "Failed to save shipment.");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!shipmentId) {
      return;
    }

    try {
      setDeleting(true);
      await shipmentsApi.deleteShipment(shipmentId);
      toast.success("Shipment deleted.");
      navigate("/shipments");
    } catch (deleteError) {
      const message = getErrorMessage(deleteError, "Failed to delete shipment.");
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
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to={isEdit && shipmentId ? `/shipments/${shipmentId}` : "/shipments"}>
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back
        </RouterLink>
        <Typography variant="h4" mt={1}>{isEdit ? "Edit Shipment" : "Create Shipment"}</Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Shipment Setup</Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFSelectField control={control} name="orderId" label="Order" size="small" fullWidth options={[{ value: "", label: "No linked order" }, ...orders.map((order) => ({ value: order.id, label: order.orderNumber }))]} disabled={isEdit} />
                  <RHFSelectField control={control} name="warehouseId" label="Warehouse" size="small" fullWidth options={warehouses.map((warehouse) => ({ value: warehouse.id, label: warehouse.name }))} disabled={isEdit} />
                  <RHFSelectField control={control} name="type" label="Type" size="small" fullWidth disabled={isEdit} options={[{ value: ShipmentType.Outbound, label: "Outbound" }, { value: ShipmentType.Transfer, label: "Transfer" }, { value: ShipmentType.Return, label: "Return" }, { value: ShipmentType.DropShip, label: "Drop Ship" }]} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFSelectField control={control} name="originAddressId" label="Origin Address" size="small" fullWidth options={addresses.map((address) => ({ value: address.id, label: `${address.contactName} - ${address.addressLine1}, ${address.city}` }))} />
                  <RHFSelectField control={control} name="destinationAddressId" label="Destination Address" size="small" fullWidth options={addresses.map((address) => ({ value: address.id, label: `${address.contactName} - ${address.addressLine1}, ${address.city}` }))} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFSelectField control={control} name="carrierId" label="Carrier" size="small" fullWidth options={[{ value: "", label: "No carrier" }, ...carriers.map((carrier) => ({ value: carrier.id, label: carrier.name }))]} />
                  <RHFSelectField control={control} name="carrierServiceId" label="Carrier Service" size="small" fullWidth options={[{ value: "", label: "No service" }, ...carrierServices.map((service) => ({ value: service.id, label: service.name }))]} />
                  <RHFSelectField control={control} name="priority" label="Priority" size="small" fullWidth options={[{ value: ShipmentPriority.Low, label: "Low" }, { value: ShipmentPriority.Normal, label: "Normal" }, { value: ShipmentPriority.High, label: "High" }, { value: ShipmentPriority.Urgent, label: "Urgent" }]} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Dates & References</Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="plannedShipDateUtc" label="Planned Ship" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <RHFTextField control={control} name="plannedDeliveryDateUtc" label="Planned Delivery" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="scheduledPickupStartUtc" label="Pickup Start" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <RHFTextField control={control} name="scheduledPickupEndUtc" label="Pickup End" type="datetime-local" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="customerReference" label="Customer Reference" size="small" fullWidth />
                  <RHFTextField control={control} name="externalReference" label="External Reference" size="small" fullWidth />
                  <RHFTextField control={control} name="currencyCode" label="Currency" size="small" fullWidth />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="trackingNumber" label="Tracking Number" size="small" fullWidth />
                  <RHFTextField control={control} name="masterTrackingNumber" label="Master Tracking Number" size="small" fullWidth />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="shippingTerms" label="Shipping Terms" size="small" fullWidth />
                  <RHFTextField control={control} name="incoterm" label="Incoterm" size="small" fullWidth />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="h6">Handling Flags</Typography>
                {!isEdit ? <RHFSwitchField control={control} name="isPartialShipment" label="Partial shipment" /> : null}
                <RHFSwitchField control={control} name="requiresSignature" label="Requires signature" />
                <RHFSwitchField control={control} name="isFragile" label="Fragile goods" />
                <RHFSwitchField control={control} name="isHazardous" label="Hazardous goods" />
                <RHFSwitchField control={control} name="isTemperatureControlled" label="Temperature controlled" />
                <RHFSwitchField control={control} name="isInsured" label="Insured shipment" />
                <RHFSwitchField control={control} name="isCrossBorder" label="Cross-border shipment" />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Notes</Typography>
                <RHFTextField control={control} name="notes" label="Notes" size="small" fullWidth multiline rows={3} />
                <RHFTextField control={control} name="internalNotes" label="Internal Notes" size="small" fullWidth multiline rows={3} />
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
            <Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : isEdit ? "Save Changes" : "Create Shipment"}</Button>
            {isEdit ? <Button color="error" variant="outlined" onClick={() => setDeleteOpen(true)}>Delete Shipment</Button> : null}
          </Stack>
        </Stack>
      </form>

      <ConfirmActionDialog
        open={deleteOpen}
        title="Delete shipment?"
        description="This removes the shipment header record."
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
        loading={deleting}
      />
    </Container>
  );
}
