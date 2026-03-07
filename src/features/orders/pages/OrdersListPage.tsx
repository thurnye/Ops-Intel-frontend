import { Box, Card, CardContent, Container, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { useOrders } from "@features/orders/hooks/useOrders";
import { setOrdersFilters } from "@features/orders/redux/slices/orders.slice";
import { OrdersTable } from "@features/orders/components/OrdersTable";

export function OrdersListPage() {
  const dispatch = useAppDispatch();
  const { filteredOrders, filters } = useOrders();

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
        <Box>
          <Typography variant="h4">Orders</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
            Manage and track all sales orders
          </Typography>
        </Box>
        <TextField
          placeholder="Search orders..."
          onChange={(e) => dispatch(setOrdersFilters({ ...filters, query: e.target.value }))}
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
          <OrdersTable orders={filteredOrders} />
        </CardContent>
      </Card>
    </Container>
  );
}
