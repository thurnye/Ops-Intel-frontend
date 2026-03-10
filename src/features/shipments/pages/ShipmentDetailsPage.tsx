import {
  Box, Card, CardContent, Chip, Container, Grid, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography
} from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/hooks/app.hooks";
import { useShipmentDetail } from "@features/shipments/hooks/useShipments";
import { fetchShipmentById } from "@features/shipments/redux/shipments.thunks";
import {
  shipmentStatusLabel, shipmentStatusColor,
  shipmentTypeLabel, shipmentPriorityLabel, shipmentPriorityColor,
  itemStatusLabel, itemStatusColor,
  packageStatusLabel, packageStatusColor,
  chargeTypeLabel, documentTypeLabel,
  formatCurrency, formatDate, formatDateTime, formatWeight
} from "@features/shipments/utils/shipments.utils";

export function ShipmentDetailsPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const dispatch = useAppDispatch();
  const shipment = useShipmentDetail(shipmentId);
  const { detailLoading } = useAppSelector((state) => state.shipments);

  useEffect(() => {
    if (shipmentId && !shipment) {
      void dispatch(fetchShipmentById(shipmentId));
    }
  }, [dispatch, shipment, shipmentId]);

  if (detailLoading && !shipment) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography variant="h6" color="text.secondary">Loading shipment...</Typography>
      </Container>
    );
  }

  if (!shipment) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography variant="h6" color="text.secondary">Shipment not found</Typography>
      </Container>
    );
  }

  const dest = shipment.destinationAddress;
  const origin = shipment.originAddress;

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
        <Typography variant="h4">{shipment.shipmentNumber}</Typography>
        <Chip label={shipmentStatusLabel(shipment.status)} size="small" sx={{ bgcolor: shipmentStatusColor(shipment.status) + "18", color: shipmentStatusColor(shipment.status), fontWeight: 600 }} />
        <Chip label={shipmentTypeLabel(shipment.type)} size="small" variant="outlined" />
        <Chip label={shipmentPriorityLabel(shipment.priority)} size="small" variant="outlined" sx={{ borderColor: shipmentPriorityColor(shipment.priority), color: shipmentPriorityColor(shipment.priority) }} />
        {shipment.isCrossBorder && <Chip label="Cross-border" size="small" sx={{ height: 22, fontSize: 11, bgcolor: "#dbeafe", color: "#2563eb" }} />}
      </Stack>

      {/* Quick info */}
      <Grid container spacing={2.5}>
        {[
          { label: "Order", value: shipment.orderNumber ?? "—" },
          { label: "Carrier", value: `${shipment.carrierName ?? "—"} ${shipment.carrierServiceName ? `(${shipment.carrierServiceName})` : ""}` },
          { label: "Tracking", value: shipment.trackingNumber ?? "—" },
          { label: "Warehouse", value: shipment.warehouseName },
          { label: "Ship Date", value: shipment.actualShipDateUtc ? formatDateTime(shipment.actualShipDateUtc) : shipment.plannedShipDateUtc ? `Planned: ${formatDate(shipment.plannedShipDateUtc)}` : "—" },
          { label: "Est. Delivery", value: shipment.plannedDeliveryDateUtc ? formatDate(shipment.plannedDeliveryDateUtc) : "—" },
          { label: "Shipping Terms", value: shipment.shippingTerms ?? "—" },
          { label: "Incoterm", value: shipment.incoterm ?? "—" },
          { label: "Customer Ref", value: shipment.customerReference ?? "—" }
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 6, md: 4 }}>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#64748b", mb: 0.25 }}>{item.label}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{item.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Addresses */}
      <Grid container spacing={2.5}>
        {[{ label: "Origin", addr: origin }, { label: "Destination", addr: dest }].map(({ label, addr }) => (
          <Grid key={label} size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>{label} Address</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{addr.contactName}</Typography>
                {addr.companyName && <Typography sx={{ fontSize: 12, color: "#64748b" }}>{addr.companyName}</Typography>}
                <Typography sx={{ fontSize: 12, color: "#475569" }}>{addr.addressLine1}</Typography>
                {addr.addressLine2 && <Typography sx={{ fontSize: 12, color: "#475569" }}>{addr.addressLine2}</Typography>}
                <Typography sx={{ fontSize: 12, color: "#475569" }}>{addr.city}, {addr.stateOrProvince} {addr.postalCode}</Typography>
                <Typography sx={{ fontSize: 12, color: "#475569" }}>{addr.country}</Typography>
                {addr.phone && <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.5 }}>{addr.phone}</Typography>}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cost + Weight summary */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Shipment Summary</Typography>
          <Grid container spacing={3}>
            {[
              { label: "Total Packages", value: String(shipment.totalPackages) },
              { label: "Total Weight", value: formatWeight(shipment.totalWeight) },
              { label: "Total Volume", value: `${shipment.totalVolume} m³` },
              { label: "Freight Cost", value: formatCurrency(shipment.freightCost, shipment.currencyCode) },
              { label: "Insurance Cost", value: formatCurrency(shipment.insuranceCost, shipment.currencyCode) },
              { label: "Other Charges", value: formatCurrency(shipment.otherCharges, shipment.currencyCode) },
              { label: "Total Shipping Cost", value: formatCurrency(shipment.totalShippingCost, shipment.currencyCode) }
            ].map((s) => (
              <Grid key={s.label} size={{ xs: 6, md: 3 }}>
                <Typography sx={{ fontSize: 12, color: "#64748b" }}>{s.label}</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{s.value}</Typography>
              </Grid>
            ))}
          </Grid>
          {/* Flags */}
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {shipment.requiresSignature && <Chip label="Signature Required" size="small" variant="outlined" sx={{ height: 22, fontSize: 11 }} />}
            {shipment.isFragile && <Chip label="Fragile" size="small" color="warning" variant="outlined" sx={{ height: 22, fontSize: 11 }} />}
            {shipment.isHazardous && <Chip label="Hazardous" size="small" color="error" variant="outlined" sx={{ height: 22, fontSize: 11 }} />}
            {shipment.isTemperatureControlled && <Chip label="Temp. Controlled" size="small" variant="outlined" sx={{ height: 22, fontSize: 11 }} />}
            {shipment.isInsured && <Chip label="Insured" size="small" color="info" variant="outlined" sx={{ height: 22, fontSize: 11 }} />}
            {shipment.isPartialShipment && <Chip label="Partial Shipment" size="small" variant="outlined" sx={{ height: 22, fontSize: 11 }} />}
          </Stack>
        </CardContent>
      </Card>

      {/* Items */}
      {shipment.items.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Items</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Line</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Ordered</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Picked</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Packed</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Shipped</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Delivered</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shipment.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ fontSize: 13 }}>{item.lineNumber}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{item.productName}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{item.orderedQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{item.pickedQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{item.packedQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{item.shippedQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{item.deliveredQuantity}</TableCell>
                      <TableCell>
                        <Chip label={itemStatusLabel(item.status)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: itemStatusColor(item.status) + "18", color: itemStatusColor(item.status), fontWeight: 600 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Packages */}
      {shipment.packages.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Packages</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Package #</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Tracking</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Dimensions (L×W×H)</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Weight</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shipment.packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>{pkg.packageNumber}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{pkg.packageType}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{pkg.trackingNumber ?? "—"}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{pkg.length}×{pkg.width}×{pkg.height} cm</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{formatWeight(pkg.weight)}</TableCell>
                      <TableCell>
                        <Chip label={packageStatusLabel(pkg.status)} size="small" sx={{ height: 22, fontSize: 11, bgcolor: packageStatusColor(pkg.status) + "18", color: packageStatusColor(pkg.status), fontWeight: 600 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Tracking Events */}
      {shipment.trackingEvents.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Tracking Events</Typography>
            <Stack spacing={1.5}>
              {shipment.trackingEvents.map((ev, i) => (
                <Stack key={ev.id} direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: i === 0 ? "#6366f1" : "#cbd5e1", mt: 0.75, flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{ev.eventName}</Typography>
                    {ev.description && <Typography sx={{ fontSize: 12, color: "#64748b" }}>{ev.description}</Typography>}
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                      {formatDateTime(ev.eventTimeUtc)}
                      {ev.city && ` — ${ev.city}${ev.stateOrProvince ? `, ${ev.stateOrProvince}` : ""}`}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Charges */}
      {shipment.charges.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Charges</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shipment.charges.map((ch) => (
                    <TableRow key={ch.id}>
                      <TableCell sx={{ fontSize: 13 }}>{chargeTypeLabel(ch.chargeType)}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{ch.description}</TableCell>
                      <TableCell sx={{ fontSize: 13, fontWeight: 600 }} align="right">{formatCurrency(ch.amount, ch.currencyCode)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      {shipment.documents.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Documents</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>File Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Size</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Customer Visible</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shipment.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell sx={{ fontSize: 13 }}>{documentTypeLabel(doc.documentType)}</TableCell>
                      <TableCell sx={{ fontSize: 13, color: "#6366f1", fontWeight: 600 }}>{doc.fileName}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{(doc.fileSizeBytes / 1024).toFixed(1)} KB</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{doc.isCustomerVisible ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Status History */}
      {shipment.statusHistories.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Status History</Typography>
            <Stack spacing={1}>
              {shipment.statusHistories.map((h) => (
                <Stack key={h.id} direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#6366f1", flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 13 }}>
                    <Box component="span" sx={{ fontWeight: 600 }}>{shipmentStatusLabel(h.fromStatus)}</Box>
                    {" → "}
                    <Box component="span" sx={{ fontWeight: 600 }}>{shipmentStatusLabel(h.toStatus)}</Box>
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                    {formatDateTime(h.changedAtUtc)} by {h.changedBy}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {shipment.notes && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>Notes</Typography>
            <Typography sx={{ fontSize: 13, color: "#475569", whiteSpace: "pre-wrap" }}>{shipment.notes}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
