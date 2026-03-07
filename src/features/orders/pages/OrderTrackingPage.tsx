import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export function OrderTrackingPage() {
  const { orderId } = useParams();

  return (
    <Container>
      <Card className="border border-slate-200 shadow-sm">
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5">Order Tracking</Typography>
            <Typography color="text.secondary">Tracking flow for {orderId}</Typography>
            <Typography color="text.secondary">1. Order Confirmed</Typography>
            <Typography color="text.secondary">2. In Production</Typography>
            <Typography color="text.secondary">3. Quality Check</Typography>
            <Typography color="text.secondary">4. Ready to Ship</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
