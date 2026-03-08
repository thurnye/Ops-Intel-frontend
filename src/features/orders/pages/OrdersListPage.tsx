import { Box, Card, CardContent, Container, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { useOrders } from "@features/orders/hooks/useOrders";
import { setOrdersFilters } from "@features/orders/redux/slices/orders.slice";
import { OrdersTable } from "@features/orders/components/OrdersTable";
import { OrderStatus } from "@features/orders/types/orders.types";

export function OrdersListPage() {
  const dispatch = useAppDispatch();
  const { orders, allOrders, filters } = useOrders();

  const processing = allOrders.filter((o) => o.status === OrderStatus.Processing).length;
  const shipped = allOrders.filter((o) => o.status === OrderStatus.Shipped || o.status === OrderStatus.Delivered).length;

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
        <Box>
          <Typography variant="h4">Orders</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
            Manage and track all orders
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack direction="row" spacing={3} sx={{ mr: 2 }}>
            <Box className="text-center">
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>{allOrders.length}</Typography>
              <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Total</Typography>
            </Box>
            <Box className="text-center">
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#3b82f6" }}>{processing}</Typography>
              <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Processing</Typography>
            </Box>
            <Box className="text-center">
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#10b981" }}>{shipped}</Typography>
              <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Shipped/Delivered</Typography>
            </Box>
          </Stack>
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
      </Stack>

      <Card>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </Container>
  );
}
