import { Box, Card, CardContent, Container, Grid, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useEffect } from "react";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { useOrders } from "@features/orders/hooks/useOrders";
import { fetchOrders } from "@features/orders/redux/orders.thunks";
import { setOrdersFilters, setOrdersPage, setOrdersPageSize } from "@features/orders/redux/slices/orders.slice";
import { OrdersTable } from "@features/orders/components/OrdersTable";
import { OrderStatus } from "@features/orders/types/orders.types";

export function OrdersListPage() {
  const dispatch = useAppDispatch();
  const { orders, allOrders, filters, page, pageSize, pagination } = useOrders();

  useEffect(() => {
    void dispatch(fetchOrders({ page, pageSize }));
  }, [dispatch, page, pageSize]);

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
      <Box>
        <Typography variant="h4">Orders</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          Manage intake, fulfillment progress, and customer delivery outcomes
        </Typography>
      </Box>

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
          onChange={(e) => dispatch(setOrdersFilters({ query: e.target.value }))}
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
