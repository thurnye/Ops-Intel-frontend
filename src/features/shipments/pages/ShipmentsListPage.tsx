import { Box, Card, CardContent, Container, Grid, Stack, Typography } from "@mui/material";
import { ShipmentsTable } from "@features/shipments/components/ShipmentsTable";
import { useShipments } from "@features/shipments/hooks/useShipments";

export function ShipmentsListPage() {
  const { shipments, filteredShipments } = useShipments();
  const pending = shipments.filter((s) => s.status === "pending" || s.status === "packing").length;
  const inTransit = shipments.filter((s) => s.status === "in_transit" || s.status === "dispatched").length;
  const delayed = shipments.filter((s) => s.status === "delayed").length;

  const stats = [
    { label: "Total", value: shipments.length, color: "#6366f1" },
    { label: "Pending", value: pending, color: "#f59e0b" },
    { label: "In Transit", value: inTransit, color: "#3b82f6" },
    { label: "Delayed", value: delayed, color: "#ef4444" }
  ];

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Shipments</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Track outbound fulfillment and delivery status</Typography>
      </Box>
      <Grid container spacing={2.5}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#64748b", mb: 0.5 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <ShipmentsTable shipments={filteredShipments} />
        </CardContent>
      </Card>
    </Container>
  );
}
