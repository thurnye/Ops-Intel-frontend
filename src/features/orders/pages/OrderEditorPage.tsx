import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { RHFTextField } from "@app/components/forms/RHFTextField";
import { RHFSelectField } from "@app/components/forms/RHFSelectField";
import { ConfirmActionDialog } from "@app/components/ConfirmActionDialog";
import { inventoryApi } from "@features/inventory/services/inventory.api.service";
import { ordersApi } from "@features/orders/services/orders.api.service";
import {
  AddressType,
  OrderChannel,
  OrderPriority,
  OrderType,
  type CreateOrderPayload,
  type OrderDetail,
  type UpdateOrderPayload
} from "@features/orders/types/orders.types";
import { type ProductListItem, type UnitOfMeasure, type Warehouse } from "@features/inventory/types/inventory.types";
import { getApiData, getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";
import { toDateInputValue, toUtcIso } from "@shared/utils/form.utils";

const itemSchema = z.object({
  productId: z.string().min(1, "Product is required."),
  unitOfMeasureId: z.string().optional(),
  quantityOrdered: z.coerce.number().positive("Quantity must be greater than 0."),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative."),
  discountAmount: z.coerce.number().min(0, "Discount cannot be negative."),
  taxAmount: z.coerce.number().min(0, "Tax cannot be negative."),
  remarks: z.string().max(500, "Remarks cannot exceed 500 characters.").optional(),
  sortOrder: z.coerce.number().min(0, "Sort order cannot be negative.")
});

const addressSchema = z.object({
  addressType: z.coerce.number().int().min(1).max(2),
  contactName: z.string().min(1, "Contact name is required.").max(150),
  companyName: z.string().max(150).optional(),
  addressLine1: z.string().min(1, "Address line 1 is required.").max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, "City is required.").max(100),
  stateOrProvince: z.string().min(1, "State / Province is required.").max(100),
  postalCode: z.string().min(1, "Postal code is required.").max(30),
  country: z.string().min(1, "Country is required.").max(100),
  phoneNumber: z.string().max(50).optional(),
  email: z.union([z.string().email("Enter a valid email."), z.literal("")]).optional()
});

const baseSchema = z.object({
  customerName: z.string().max(200).optional(),
  customerEmail: z.union([z.string().email("Enter a valid email."), z.literal("")]).optional(),
  customerPhone: z.string().max(50).optional(),
  orderType: z.coerce.number().int().min(1),
  priority: z.coerce.number().int().min(1),
  channel: z.coerce.number().int().min(1),
  warehouseId: z.string().optional(),
  requiredDateUtc: z.string().optional(),
  currencyCode: z.string().min(1).max(10),
  referenceNumber: z.string().max(100).optional(),
  customerPurchaseOrderNumber: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
  items: z.array(itemSchema),
  addresses: z.array(addressSchema)
});

type OrderFormValues = z.infer<typeof baseSchema>;

const defaultItem = (sortOrder: number) => ({
  productId: "",
  unitOfMeasureId: "",
  quantityOrdered: 1,
  unitPrice: 0,
  discountAmount: 0,
  taxAmount: 0,
  remarks: "",
  sortOrder
});

const defaultAddress = (addressType: AddressType) => ({
  addressType,
  contactName: "",
  companyName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateOrProvince: "",
  postalCode: "",
  country: "",
  phoneNumber: "",
  email: ""
});

const defaultValues: OrderFormValues = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  orderType: OrderType.Sales,
  priority: OrderPriority.Normal,
  channel: OrderChannel.Internal,
  warehouseId: "",
  requiredDateUtc: "",
  currencyCode: "CAD",
  referenceNumber: "",
  customerPurchaseOrderNumber: "",
  notes: "",
  items: [defaultItem(0)],
  addresses: [defaultAddress(AddressType.Billing), defaultAddress(AddressType.Shipping)]
};

function toFormValues(order: OrderDetail): OrderFormValues {
  return {
    customerName: order.customerName ?? "",
    customerEmail: order.customerEmail ?? "",
    customerPhone: order.customerPhone ?? "",
    orderType: order.orderType,
    priority: order.priority,
    channel: order.channel,
    warehouseId: order.warehouseId ?? "",
    requiredDateUtc: toDateInputValue(order.requiredDateUtc),
    currencyCode: order.currencyCode,
    referenceNumber: order.referenceNumber ?? "",
    customerPurchaseOrderNumber: order.customerPurchaseOrderNumber ?? "",
    notes: order.notes ?? "",
    items: order.items.map((item, index) => ({
      productId: item.productId,
      unitOfMeasureId: "",
      quantityOrdered: item.quantityOrdered,
      unitPrice: item.unitPrice,
      discountAmount: item.discountAmount,
      taxAmount: item.taxAmount,
      remarks: "",
      sortOrder: index
    })),
    addresses: order.addresses.map((address) => ({
      addressType: address.addressType,
      contactName: address.contactName,
      companyName: address.companyName ?? "",
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? "",
      city: address.city,
      stateOrProvince: address.stateOrProvince,
      postalCode: address.postalCode,
      country: address.country,
      phoneNumber: "",
      email: ""
    }))
  };
}

export function OrderEditorPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(orderId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const schema = useMemo(() => baseSchema.superRefine((value, ctx) => {
    if (!isEdit && value.items.length === 0) {
      ctx.addIssue({ code: "custom", path: ["items"], message: "At least one item is required." });
    }
  }), [isEdit]);

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = form;

  const itemsFieldArray = useFieldArray({ control, name: "items" });
  const addressesFieldArray = useFieldArray({ control, name: "addresses" });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(isEdit);
        setError(null);

        const [productsResponse, unitsResponse, warehousesResponse, orderResponse] = await Promise.all([
          inventoryApi.listProducts({ pageNumber: 1, pageSize: 200 }),
          inventoryApi.listUnits(),
          inventoryApi.listWarehouses(),
          orderId ? ordersApi.getOrder(orderId) : Promise.resolve(null)
        ]);

        if (!active) {
          return;
        }

        setProducts(getPagedItems(productsResponse));
        setUnits(getApiData(unitsResponse, []));
        setWarehouses(getApiData(warehousesResponse, []));

        if (orderResponse?.data) {
          reset(toFormValues(orderResponse.data));
        }
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError, "Failed to load order form."));
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

  const productOptions = products.map((product) => ({ value: product.id, label: `${product.name} (${product.sku})` }));
  const unitOptions = units.map((unit) => ({ value: unit.id, label: `${unit.name} (${unit.symbol})` }));
  const warehouseOptions = [{ value: "", label: "No warehouse" }, ...warehouses.map((warehouse) => ({ value: warehouse.id, label: warehouse.name }))];

  async function onSubmit(values: OrderFormValues) {
    try {
      setSaving(true);
      setError(null);

      if (isEdit && orderId) {
        const payload: UpdateOrderPayload = {
          customerName: values.customerName || undefined,
          customerEmail: values.customerEmail || undefined,
          customerPhone: values.customerPhone || undefined,
          priority: values.priority,
          warehouseId: values.warehouseId || undefined,
          requiredDateUtc: toUtcIso(values.requiredDateUtc),
          referenceNumber: values.referenceNumber || undefined,
          customerPurchaseOrderNumber: values.customerPurchaseOrderNumber || undefined,
          notes: values.notes || undefined
        };

        const response = await ordersApi.updateOrder(orderId, payload);
        toast.success("Order updated.");
        navigate(`/orders/${response.data?.id ?? orderId}`);
        return;
      }

      const payload: CreateOrderPayload = {
        customerName: values.customerName || undefined,
        customerEmail: values.customerEmail || undefined,
        customerPhone: values.customerPhone || undefined,
        orderType: values.orderType,
        priority: values.priority,
        channel: values.channel,
        warehouseId: values.warehouseId || undefined,
        requiredDateUtc: toUtcIso(values.requiredDateUtc),
        currencyCode: values.currencyCode,
        referenceNumber: values.referenceNumber || undefined,
        customerPurchaseOrderNumber: values.customerPurchaseOrderNumber || undefined,
        notes: values.notes || undefined,
        items: values.items.map((item) => ({
          productId: item.productId,
          unitOfMeasureId: item.unitOfMeasureId || undefined,
          quantityOrdered: item.quantityOrdered,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount,
          taxAmount: item.taxAmount,
          remarks: item.remarks || undefined,
          sortOrder: item.sortOrder
        })),
        addresses: values.addresses.map((address) => ({
          addressType: address.addressType,
          contactName: address.contactName,
          companyName: address.companyName || undefined,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2 || undefined,
          city: address.city,
          stateOrProvince: address.stateOrProvince,
          postalCode: address.postalCode,
          country: address.country,
          phoneNumber: address.phoneNumber || undefined,
          email: address.email || undefined
        }))
      };

      const response = await ordersApi.createOrder(payload);
      toast.success("Order created.");
      navigate(`/orders/${response.data?.id}`);
    } catch (submitError) {
      const message = getErrorMessage(submitError, "Failed to save order.");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!orderId) {
      return;
    }

    try {
      setDeleting(true);
      await ordersApi.deleteOrder(orderId);
      toast.success("Order deleted.");
      navigate("/orders");
    } catch (deleteError) {
      const message = getErrorMessage(deleteError, "Failed to delete order.");
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  }

  if (loading) {
    return (
      <Container maxWidth={false} disableGutters className="space-y-5">
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 320 }}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Box>
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to={isEdit && orderId ? `/orders/${orderId}` : "/orders"}>
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back
        </RouterLink>
        <Typography variant="h4" mt={1}>{isEdit ? "Edit Order" : "Create Order"}</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          {isEdit ? "Update editable order metadata." : "Create a new order with items and shipping or billing addresses."}
        </Typography>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Order Profile</Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="customerName" label="Customer Name" size="small" fullWidth />
                  <RHFTextField control={control} name="customerEmail" label="Customer Email" size="small" fullWidth />
                  <RHFTextField control={control} name="customerPhone" label="Customer Phone" size="small" fullWidth />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFSelectField
                    control={control}
                    name="orderType"
                    label="Order Type"
                    size="small"
                    fullWidth
                    disabled={isEdit}
                    options={[
                      { value: OrderType.Sales, label: "Sales" },
                      { value: OrderType.Purchase, label: "Purchase" },
                      { value: OrderType.Transfer, label: "Transfer" },
                      { value: OrderType.Return, label: "Return" }
                    ]}
                  />
                  <RHFSelectField
                    control={control}
                    name="priority"
                    label="Priority"
                    size="small"
                    fullWidth
                    options={[
                      { value: OrderPriority.Low, label: "Low" },
                      { value: OrderPriority.Normal, label: "Normal" },
                      { value: OrderPriority.High, label: "High" },
                      { value: OrderPriority.Urgent, label: "Urgent" }
                    ]}
                  />
                  <RHFSelectField
                    control={control}
                    name="channel"
                    label="Channel"
                    size="small"
                    fullWidth
                    disabled={isEdit}
                    options={[
                      { value: OrderChannel.Internal, label: "Internal" },
                      { value: OrderChannel.Web, label: "Web" },
                      { value: OrderChannel.Mobile, label: "Mobile" },
                      { value: OrderChannel.Phone, label: "Phone" },
                      { value: OrderChannel.Email, label: "Email" },
                      { value: OrderChannel.Marketplace, label: "Marketplace" }
                    ]}
                  />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFSelectField control={control} name="warehouseId" label="Warehouse" size="small" fullWidth options={warehouseOptions} />
                  <RHFTextField control={control} name="requiredDateUtc" label="Required Date" type="date" size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
                  <RHFTextField control={control} name="currencyCode" label="Currency" size="small" fullWidth disabled={isEdit} />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <RHFTextField control={control} name="referenceNumber" label="Reference Number" size="small" fullWidth />
                  <RHFTextField control={control} name="customerPurchaseOrderNumber" label="Customer PO Number" size="small" fullWidth />
                </Stack>
                <RHFTextField control={control} name="notes" label="Notes" size="small" fullWidth multiline rows={4} />
              </Stack>
            </CardContent>
          </Card>

          {!isEdit ? (
            <>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">Items</Typography>
                      <Button startIcon={<AddIcon />} onClick={() => itemsFieldArray.append(defaultItem(itemsFieldArray.fields.length))}>Add Item</Button>
                    </Stack>
                    {itemsFieldArray.fields.map((field, index) => (
                      <Card key={field.id} variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography sx={{ fontWeight: 600 }}>Line {index + 1}</Typography>
                              <IconButton onClick={() => itemsFieldArray.remove(index)} disabled={itemsFieldArray.fields.length === 1}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                              <RHFSelectField control={control} name={`items.${index}.productId`} label="Product" size="small" fullWidth options={productOptions} />
                              <RHFSelectField control={control} name={`items.${index}.unitOfMeasureId`} label="Unit" size="small" fullWidth options={[{ value: "", label: "Default unit" }, ...unitOptions]} />
                            </Stack>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                              <RHFTextField control={control} name={`items.${index}.quantityOrdered`} label="Quantity" type="number" size="small" fullWidth />
                              <RHFTextField control={control} name={`items.${index}.unitPrice`} label="Unit Price" type="number" size="small" fullWidth />
                              <RHFTextField control={control} name={`items.${index}.taxAmount`} label="Tax Amount" type="number" size="small" fullWidth />
                              <RHFTextField control={control} name={`items.${index}.discountAmount`} label="Discount" type="number" size="small" fullWidth />
                            </Stack>
                            <RHFTextField control={control} name={`items.${index}.remarks`} label="Remarks" size="small" fullWidth />
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Typography variant="h6">Addresses</Typography>
                    {addressesFieldArray.fields.map((field, index) => (
                      <Card key={field.id} variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Stack spacing={2}>
                            <Typography sx={{ fontWeight: 600 }}>{index === 0 ? "Billing Address" : "Shipping Address"}</Typography>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                              <RHFSelectField
                                control={control}
                                name={`addresses.${index}.addressType`}
                                label="Address Type"
                                size="small"
                                fullWidth
                                options={[
                                  { value: AddressType.Billing, label: "Billing" },
                                  { value: AddressType.Shipping, label: "Shipping" }
                                ]}
                              />
                              <RHFTextField control={control} name={`addresses.${index}.contactName`} label="Contact Name" size="small" fullWidth />
                              <RHFTextField control={control} name={`addresses.${index}.companyName`} label="Company Name" size="small" fullWidth />
                            </Stack>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                              <RHFTextField control={control} name={`addresses.${index}.addressLine1`} label="Address Line 1" size="small" fullWidth />
                              <RHFTextField control={control} name={`addresses.${index}.addressLine2`} label="Address Line 2" size="small" fullWidth />
                            </Stack>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                              <RHFTextField control={control} name={`addresses.${index}.city`} label="City" size="small" fullWidth />
                              <RHFTextField control={control} name={`addresses.${index}.stateOrProvince`} label="State / Province" size="small" fullWidth />
                              <RHFTextField control={control} name={`addresses.${index}.postalCode`} label="Postal Code" size="small" fullWidth />
                              <RHFTextField control={control} name={`addresses.${index}.country`} label="Country" size="small" fullWidth />
                            </Stack>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                              <RHFTextField control={control} name={`addresses.${index}.phoneNumber`} label="Phone" size="small" fullWidth />
                              <RHFTextField control={control} name={`addresses.${index}.email`} label="Email" size="small" fullWidth />
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert severity="info">
              This endpoint only updates order metadata. Line items and addresses are shown on the detail view but are not editable through the primary order update endpoint.
            </Alert>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1.5}>
              <Button type="submit" variant="contained" disabled={saving || isSubmitting}>
                {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Order"}
              </Button>
              <Button variant="outlined" onClick={() => reset(defaultValues)} disabled={saving || isSubmitting || isEdit}>
                Reset
              </Button>
            </Stack>
            {isEdit ? (
              <Button color="error" variant="outlined" onClick={() => setDeleteDialogOpen(true)} disabled={deleting}>
                Delete Order
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </form>

      <ConfirmActionDialog
        open={deleteDialogOpen}
        title="Delete order?"
        description="This will permanently delete the order record."
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={() => void handleDelete()}
        loading={deleting}
      />
    </Container>
  );
}
