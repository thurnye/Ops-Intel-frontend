import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useOrders } from "@features/orders/hooks/useOrders";

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const { orders } = useOrders();
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return (
      <Container>
        <Typography>Order not found.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="border border-slate-200 shadow-sm">
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5">Order {order.id}</Typography>
            <Typography color="text.secondary">Customer: {order.customerName}</Typography>
            <Typography color="text.secondary">Product: {order.product}</Typography>
            <Typography color="text.secondary">Quantity: {order.quantity}</Typography>
            <Typography color="text.secondary">Due: {order.dueDate}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
