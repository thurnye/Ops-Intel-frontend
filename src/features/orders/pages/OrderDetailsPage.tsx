import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/hooks/app.hooks";
import { useOrderDetail } from "@features/orders/hooks/useOrders";
import { fetchOrderById } from "@features/orders/redux/orders.thunks";
import {
  orderStatusLabel,
  orderStatusColor,
  paymentStatusLabel,
  paymentStatusColor,
  orderTypeLabel,
  priorityLabel,
  priorityColor,
  channelLabel,
  paymentMethodLabel,
  formatCurrency,
  formatDate
} from "@features/orders/utils/orders.utils";
import { AddressType } from "@features/orders/types/orders.types";

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const dispatch = useAppDispatch();
  const order = useOrderDetail(orderId);
  const { detailLoading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (orderId && !order) {
      void dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, order, orderId]);

  if (detailLoading && !order) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography sx={{ color: "#64748b" }}>Loading order...</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography sx={{ color: "#64748b" }}>Order not found.</Typography>
      </Container>
    );
  }

  const shipping = order.addresses.find((a) => a.addressType === AddressType.Shipping);
  const billing = order.addresses.find((a) => a.addressType === AddressType.Billing);

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      {/* Header */}
      <Box>
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to="/orders">
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back to Orders
        </RouterLink>
        <Stack direction="row" alignItems="center" spacing={2} mt={1}>
          <Typography variant="h4">{order.orderNumber}</Typography>
          <Chip label={orderStatusLabel(order.status)} size="small" sx={{ fontSize: 11, fontWeight: 600, bgcolor: `${orderStatusColor(order.status)}18`, color: orderStatusColor(order.status) }} />
          <Chip label={paymentStatusLabel(order.paymentStatus)} size="small" sx={{ fontSize: 11, fontWeight: 600, bgcolor: `${paymentStatusColor(order.paymentStatus)}18`, color: paymentStatusColor(order.paymentStatus) }} />
        </Stack>
        {order.customerName && (
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>{order.customerName}</Typography>
        )}
      </Box>

      {/* Quick info cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {[
          { label: "Type", value: orderTypeLabel(order.orderType) },
          { label: "Priority", value: priorityLabel(order.priority), color: priorityColor(order.priority) },
          { label: "Channel", value: channelLabel(order.channel) },
          { label: "Order Date", value: formatDate(order.orderDateUtc) },
          ...(order.requiredDateUtc ? [{ label: "Required By", value: formatDate(order.requiredDateUtc) }] : [])
        ].map((s) => (
          <Card key={s.label} className="flex-1">
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "color" in s ? s.color : "#0f172a", mt: 0.25 }}>{s.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Financials */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Card className="flex-1">
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mb: 2 }}>Financials</Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Total</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(order.totalAmount, order.currencyCode)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Paid</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>{formatCurrency(order.paidAmount, order.currencyCode)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Outstanding</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: order.outstandingAmount > 0 ? "#f59e0b" : "#10b981" }}>
                  {formatCurrency(order.outstandingAmount, order.currencyCode)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Addresses */}
        {(shipping || billing) && (
          <Card className="flex-1">
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mb: 2 }}>Addresses</Typography>
              <Stack spacing={2}>
                {shipping && (
                  <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", mb: 0.5 }}>Shipping</Typography>
                    <Typography sx={{ fontSize: 13, color: "#334155" }}>
                      {shipping.contactName}{shipping.companyName ? ` — ${shipping.companyName}` : ""}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                      {shipping.addressLine1}, {shipping.city}, {shipping.stateOrProvince} {shipping.postalCode}
                    </Typography>
                  </Box>
                )}
                {billing && (
                  <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", mb: 0.5 }}>Billing</Typography>
                    <Typography sx={{ fontSize: 13, color: "#334155" }}>
                      {billing.contactName}{billing.companyName ? ` — ${billing.companyName}` : ""}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                      {billing.addressLine1}, {billing.city}, {billing.stateOrProvince} {billing.postalCode}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>

      {/* Line items */}
      {order.items.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mb: 2 }}>Line Items</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Tax</TableCell>
                    <TableCell align="right">Line Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ fontWeight: 500 }}>{item.productNameSnapshot}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>{item.productSkuSnapshot}</Typography>
                      </TableCell>
                      <TableCell align="right">{item.quantityOrdered}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell align="right" sx={{ color: "#94a3b8" }}>{formatCurrency(item.discountAmount)}</TableCell>
                      <TableCell align="right" sx={{ color: "#94a3b8" }}>{formatCurrency(item.taxAmount)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(item.lineTotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Payments */}
      {order.payments.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mb: 2 }}>Payments</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Fee</TableCell>
                    <TableCell align="right">Net</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Typography sx={{ fontSize: 12, fontFamily: "monospace" }}>{p.paymentReference}</Typography>
                      </TableCell>
                      <TableCell>{paymentMethodLabel(p.paymentMethod)}</TableCell>
                      <TableCell>{formatDate(p.paymentDateUtc)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(p.amount)}</TableCell>
                      <TableCell align="right" sx={{ color: "#94a3b8" }}>{formatCurrency(p.feeAmount)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(p.netAmount)}</TableCell>
                      <TableCell align="center">
                        <Chip label={paymentStatusLabel(p.status)} size="small" sx={{ fontSize: 11, fontWeight: 600, bgcolor: `${paymentStatusColor(p.status)}18`, color: paymentStatusColor(p.status) }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Status history */}
      {order.statusHistory.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mb: 2 }}>Status History</Typography>
            <Stack spacing={1.5}>
              {order.statusHistory.map((h) => (
                <Stack key={h.id} direction="row" spacing={2} alignItems="center">
                  <Typography sx={{ fontSize: 12, color: "#94a3b8", minWidth: 100 }}>
                    {formatDate(h.changedAtUtc)}
                  </Typography>
                  <Chip label={orderStatusLabel(h.fromStatus)} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                  <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>&rarr;</Typography>
                  <Chip label={orderStatusLabel(h.toStatus)} size="small" sx={{ fontSize: 11, fontWeight: 600, bgcolor: `${orderStatusColor(h.toStatus)}18`, color: orderStatusColor(h.toStatus) }} />
                  {h.changedBy && <Typography sx={{ fontSize: 12, color: "#64748b" }}>by {h.changedBy}</Typography>}
                  {h.comments && <Typography sx={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>— {h.comments}</Typography>}
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {order.notesList.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mb: 2 }}>Notes</Typography>
            <Stack spacing={1.5}>
              {order.notesList.map((n) => (
                <Box key={n.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: n.isInternal ? "#fef9c3" : "#f8fafc" }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                    {n.isInternal && <Chip label="Internal" size="small" sx={{ fontSize: 10, height: 20, bgcolor: "#fbbf24", color: "#78350f" }} />}
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                      {n.createdBy} &middot; {formatDate(n.createdAtUtc)}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: 13, color: "#334155" }}>{n.note}</Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
