import { Box, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@app/hooks/app.hooks";
import { shipmentStatusLabel, shipmentStatusColor } from "@features/shipments/utils/shipments.utils";

export function ShipmentDetailsPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const shipment = useAppSelector((s) => s.shipments.shipments.find((sh) => sh.id === shipmentId));

  if (!shipment) return <Typography variant="h6" color="text.secondary">Shipment not found</Typography>;

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h4">{shipment.id}</Typography>
        <Chip label={shipmentStatusLabel(shipment.status)} color={shipmentStatusColor(shipment.status)} size="small" />
      </Stack>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            {[
              { label: "Customer", value: shipment.customerName },
              { label: "Order", value: shipment.orderId },
              { label: "Carrier", value: shipment.carrier },
              { label: "Tracking", value: shipment.trackingNumber || "—" },
              { label: "Est. Delivery", value: shipment.estimatedDelivery }
            ].map((f) => (
              <Box key={f.label}>
                <Typography sx={{ fontSize: 12, color: "#64748b", mb: 0.25 }}>{f.label}</Typography>
                <Typography sx={{ fontWeight: 600 }}>{f.value}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
