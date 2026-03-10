import {
  Box, Button, Card, CardContent, Container, Grid, Stack,
  TextField, InputAdornment, Typography, MenuItem, Select, type SelectChangeEvent
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ShipmentsTable } from "@features/shipments/components/ShipmentsTable";
import { useShipments } from "@features/shipments/hooks/useShipments";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { fetchShipments } from "@features/shipments/redux/shipments.thunks";
import { setShipmentFilters, setShipmentsPage, setShipmentsPageSize } from "@features/shipments/redux/slices/shipments.slice";
import { ShipmentStatus, ShipmentType, ShipmentPriority } from "@features/shipments/types/shipments.types";

export function ShipmentsListPage() {
  const dispatch = useAppDispatch();
  const { shipments, allShipments, filters, page, pageSize, pagination } = useShipments();

  useEffect(() => {
    void dispatch(fetchShipments({ page, pageSize, filters }));
  }, [dispatch, filters, page, pageSize]);

  const inTransit = allShipments.filter((s) => s.status === ShipmentStatus.InTransit || s.status === ShipmentStatus.OutForDelivery || s.status === ShipmentStatus.Dispatched).length;
  const processing = allShipments.filter((s) => [ShipmentStatus.AwaitingAllocation, ShipmentStatus.Allocated, ShipmentStatus.Picking, ShipmentStatus.Picked, ShipmentStatus.Packing, ShipmentStatus.Packed, ShipmentStatus.ReadyToDispatch].includes(s.status)).length;
  const delivered = allShipments.filter((s) => s.status === ShipmentStatus.Delivered).length;
  const failed = allShipments.filter((s) => s.status === ShipmentStatus.DeliveryFailed).length;

  const stats = [
    { label: "Total", value: pagination?.total ?? allShipments.length, color: "#6366f1" },
    { label: "Processing", value: processing, color: "#f59e0b" },
    { label: "In Transit", value: inTransit, color: "#3b82f6" },
    { label: "Delivered", value: delivered, color: "#10b981" },
    { label: "Failed", value: failed, color: "#ef4444" }
  ];

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
        <Box>
          <Typography variant="h4">Shipments</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Track outbound fulfillment, packages, and delivery status</Typography>
        </Box>
        <Button component={RouterLink} to="/shipments/new" variant="contained" startIcon={<AddIcon />}>
          Create Shipment
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 2.4 }}>
            <Card>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#64748b", mb: 0.5 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          size="small"
          placeholder="Search shipments..."
          value={filters.query}
          onChange={(e) => {
            dispatch(setShipmentsPage(1));
            dispatch(setShipmentFilters({ query: e.target.value }));
          }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment> } }}
          sx={{ minWidth: 260 }}
        />
        <Select size="small" value={String(filters.status)} onChange={(e: SelectChangeEvent<string>) => { dispatch(setShipmentsPage(1)); dispatch(setShipmentFilters({ status: e.target.value === "all" ? "all" : Number(e.target.value) as ShipmentStatus })); }} sx={{ minWidth: 160 }}>
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value={ShipmentStatus.Draft}>Draft</MenuItem>
          <MenuItem value={ShipmentStatus.AwaitingAllocation}>Awaiting Allocation</MenuItem>
          <MenuItem value={ShipmentStatus.Picking}>Picking</MenuItem>
          <MenuItem value={ShipmentStatus.Packing}>Packing</MenuItem>
          <MenuItem value={ShipmentStatus.ReadyToDispatch}>Ready to Dispatch</MenuItem>
          <MenuItem value={ShipmentStatus.Dispatched}>Dispatched</MenuItem>
          <MenuItem value={ShipmentStatus.InTransit}>In Transit</MenuItem>
          <MenuItem value={ShipmentStatus.OutForDelivery}>Out for Delivery</MenuItem>
          <MenuItem value={ShipmentStatus.Delivered}>Delivered</MenuItem>
          <MenuItem value={ShipmentStatus.DeliveryFailed}>Delivery Failed</MenuItem>
          <MenuItem value={ShipmentStatus.Returned}>Returned</MenuItem>
          <MenuItem value={ShipmentStatus.Cancelled}>Cancelled</MenuItem>
        </Select>
        <Select size="small" value={String(filters.type)} onChange={(e: SelectChangeEvent<string>) => { dispatch(setShipmentsPage(1)); dispatch(setShipmentFilters({ type: e.target.value === "all" ? "all" : Number(e.target.value) as ShipmentType })); }} sx={{ minWidth: 130 }}>
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value={ShipmentType.Outbound}>Outbound</MenuItem>
          <MenuItem value={ShipmentType.Transfer}>Transfer</MenuItem>
          <MenuItem value={ShipmentType.Return}>Return</MenuItem>
          <MenuItem value={ShipmentType.DropShip}>Drop Ship</MenuItem>
        </Select>
        <Select size="small" value={String(filters.priority)} onChange={(e: SelectChangeEvent<string>) => { dispatch(setShipmentsPage(1)); dispatch(setShipmentFilters({ priority: e.target.value === "all" ? "all" : Number(e.target.value) as ShipmentPriority })); }} sx={{ minWidth: 130 }}>
          <MenuItem value="all">All Priorities</MenuItem>
          <MenuItem value={ShipmentPriority.Low}>Low</MenuItem>
          <MenuItem value={ShipmentPriority.Normal}>Normal</MenuItem>
          <MenuItem value={ShipmentPriority.High}>High</MenuItem>
          <MenuItem value={ShipmentPriority.Urgent}>Urgent</MenuItem>
        </Select>
        <Select size="small" value={String(filters.isCrossBorder)} onChange={(e: SelectChangeEvent<string>) => { dispatch(setShipmentsPage(1)); dispatch(setShipmentFilters({ isCrossBorder: e.target.value === "all" ? "all" : e.target.value === "true" })); }} sx={{ minWidth: 150 }}>
          <MenuItem value="all">All Borders</MenuItem>
          <MenuItem value="true">Cross-border</MenuItem>
          <MenuItem value="false">Domestic</MenuItem>
        </Select>
        <Select size="small" value={String(filters.isPartialShipment)} onChange={(e: SelectChangeEvent<string>) => { dispatch(setShipmentsPage(1)); dispatch(setShipmentFilters({ isPartialShipment: e.target.value === "all" ? "all" : e.target.value === "true" })); }} sx={{ minWidth: 170 }}>
          <MenuItem value="all">All Shipment Splits</MenuItem>
          <MenuItem value="true">Partial Only</MenuItem>
          <MenuItem value="false">Full Only</MenuItem>
        </Select>
      </Stack>

      <Card>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <ShipmentsTable
            shipments={shipments}
            page={page}
            pageSize={pageSize}
            totalRows={pagination?.total ?? 0}
            onPageChange={(nextPage) => dispatch(setShipmentsPage(nextPage))}
            onPageSizeChange={(nextPageSize) => {
              dispatch(setShipmentsPageSize(nextPageSize));
              dispatch(setShipmentsPage(1));
            }}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
