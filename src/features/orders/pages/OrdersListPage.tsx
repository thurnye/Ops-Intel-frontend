import { Box, Button, Card, CardContent, Container, Grid, InputAdornment, MenuItem, Select, Stack, TextField, Typography, type SelectChangeEvent } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { useOrders } from "@features/orders/hooks/useOrders";
import { fetchOrders } from "@features/orders/redux/orders.thunks";
import { setOrdersFilters, setOrdersPage, setOrdersPageSize } from "@features/orders/redux/slices/orders.slice";
import { OrdersTable } from "@features/orders/components/OrdersTable";
import { OrderStatus, OrderType } from "@features/orders/types/orders.types";

export function OrdersListPage() {
  const dispatch = useAppDispatch();
  const { orders, allOrders, filters, page, pageSize, pagination } = useOrders();

  useEffect(() => {
    void dispatch(fetchOrders({ page, pageSize, filters }));
  }, [dispatch, filters, page, pageSize]);

  const processing = allOrders.filter((o) => o.status === OrderStatus.Processing).length;
  const shipped = allOrders.filter((o) => o.status === OrderStatus.Shipped || o.status === OrderStatus.Delivered).length;
  const awaitingAction = allOrders.filter((o) => o.status === OrderStatus.PendingApproval || o.status === OrderStatus.Approved).length;

  const stats = [
    { label: "Total Orders", value: pagination?.total ?? allOrders.length, color: "#6366f1" },
    { label: "Awaiting Action", value: awaitingAction, color: "#8b5cf6" },
    { label: "Processing", value: processing, color: "#3b82f6" },
    { label: "Shipped / Delivered", value: shipped, color: "#10b981" }
  ];

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
        <Box>
          <Typography variant="h4">Orders</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
            Manage intake, fulfillment progress, and customer delivery outcomes
          </Typography>
        </Box>
        <Button component={RouterLink} to="/orders/new" variant="contained" startIcon={<AddIcon />}>
          Create Order
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#64748b", mb: 0.5 }}>{stat.label}</Typography>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, color: stat.color, lineHeight: 1.2 }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          placeholder="Search orders..."
          onChange={(e) => {
            dispatch(setOrdersPage(1));
            dispatch(setOrdersFilters({ query: e.target.value }));
          }}
          size="small"
          value={filters.query}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                </InputAdornment>
              )
            }
          }}
          sx={{ minWidth: 260 }}
        />
        <Select
          size="small"
          value={String(filters.status)}
          onChange={(e: SelectChangeEvent<string>) => {
            dispatch(setOrdersPage(1));
            dispatch(setOrdersFilters({ status: e.target.value === "all" ? "all" : Number(e.target.value) as OrderStatus }));
          }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value={OrderStatus.Draft}>Draft</MenuItem>
          <MenuItem value={OrderStatus.PendingApproval}>Pending Approval</MenuItem>
          <MenuItem value={OrderStatus.Approved}>Approved</MenuItem>
          <MenuItem value={OrderStatus.Processing}>Processing</MenuItem>
          <MenuItem value={OrderStatus.Fulfilled}>Fulfilled</MenuItem>
          <MenuItem value={OrderStatus.Shipped}>Shipped</MenuItem>
          <MenuItem value={OrderStatus.Delivered}>Delivered</MenuItem>
          <MenuItem value={OrderStatus.Cancelled}>Cancelled</MenuItem>
          <MenuItem value={OrderStatus.Returned}>Returned</MenuItem>
        </Select>
        <Select
          size="small"
          value={String(filters.orderType)}
          onChange={(e: SelectChangeEvent<string>) => {
            dispatch(setOrdersPage(1));
            dispatch(setOrdersFilters({ orderType: e.target.value === "all" ? "all" : Number(e.target.value) as OrderType }));
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value={OrderType.Sales}>Sales</MenuItem>
          <MenuItem value={OrderType.Purchase}>Purchase</MenuItem>
          <MenuItem value={OrderType.Transfer}>Transfer</MenuItem>
          <MenuItem value={OrderType.Return}>Return</MenuItem>
        </Select>
      </Stack>

      <Card>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <OrdersTable
            orders={orders}
            page={page}
            pageSize={pageSize}
            totalRows={pagination?.total ?? 0}
            onPageChange={(nextPage) => dispatch(setOrdersPage(nextPage))}
            onPageSizeChange={(nextPageSize) => {
              dispatch(setOrdersPageSize(nextPageSize));
              dispatch(setOrdersPage(1));
            }}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
