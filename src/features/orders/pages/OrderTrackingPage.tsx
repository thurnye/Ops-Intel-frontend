import { Box, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/hooks/app.hooks";
import { useOrderDetail } from "@features/orders/hooks/useOrders";
import { fetchOrderById } from "@features/orders/redux/orders.thunks";
import { orderStatusLabel, orderStatusColor, formatDate } from "@features/orders/utils/orders.utils";

export function OrderTrackingPage() {
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

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Box>
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to={`/orders/${orderId}`}>
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back to Order
        </RouterLink>
        <Typography variant="h4" mt={1}>Tracking — {order.orderNumber}</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            {order.statusHistory.map((h, i) => (
              <Stack key={h.id} direction="row" spacing={2} alignItems="flex-start">
                <Box className="flex flex-col items-center">
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: orderStatusColor(h.toStatus) }} />
                  {i < order.statusHistory.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: "#e2e8f0", mt: 0.5 }} />}
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={orderStatusLabel(h.toStatus)} size="small" sx={{ fontSize: 11, fontWeight: 600, bgcolor: `${orderStatusColor(h.toStatus)}18`, color: orderStatusColor(h.toStatus) }} />
                    <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>{formatDate(h.changedAtUtc)}</Typography>
                  </Stack>
                  {h.changedBy && <Typography sx={{ fontSize: 12, color: "#64748b", mt: 0.5 }}>by {h.changedBy}</Typography>}
                  {h.comments && <Typography sx={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>{h.comments}</Typography>}
                </Box>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
