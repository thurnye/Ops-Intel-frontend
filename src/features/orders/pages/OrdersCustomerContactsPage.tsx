import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { ordersApi } from "@features/orders/services/orders.api.service";
import { orderTypeLabel, orderStatusLabel } from "@features/orders/utils/orders.utils";
import { getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";

type CustomerContactRow = {
  customerName: string;
  orderCount: number;
  latestOrderNumber: string;
  latestOrderDate: string;
  totalAmount: number;
  latestOrderType: string;
  latestStatus: string;
};

export function OrdersCustomerContactsPage() {
  const [rows, setRows] = useState<CustomerContactRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void ordersApi.listOrders({ pageNumber: 1, pageSize: 100 })
      .then((response) => {
        const orders = getPagedItems(response);
        const grouped = orders.reduce<Map<string, CustomerContactRow>>((map, order) => {
          const key = order.customerName?.trim() || "Walk-in / Internal";
          const existing = map.get(key);
          const orderDate = new Date(order.orderDateUtc);

          if (!existing) {
            map.set(key, {
              customerName: key,
              orderCount: 1,
              latestOrderNumber: order.orderNumber,
              latestOrderDate: order.orderDateUtc,
              totalAmount: order.totalAmount,
              latestOrderType: orderTypeLabel(order.orderType),
              latestStatus: orderStatusLabel(order.status)
            });
            return map;
          }

          existing.orderCount += 1;
          existing.totalAmount += order.totalAmount;
          if (orderDate > new Date(existing.latestOrderDate)) {
            existing.latestOrderNumber = order.orderNumber;
            existing.latestOrderDate = order.orderDateUtc;
            existing.latestOrderType = orderTypeLabel(order.orderType);
            existing.latestStatus = orderStatusLabel(order.status);
          }

          return map;
        }, new Map());

        setRows(Array.from(grouped.values()).sort((a, b) => b.orderCount - a.orderCount));
      })
      .catch((loadError) => setError(getErrorMessage(loadError, "Failed to load customer contact context.")));
  }, []);

  const columns = useMemo<AppDataTableColumnDef<CustomerContactRow>[]>(() => [
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "orderCount", header: "Orders", meta: { align: "center" } },
    { accessorKey: "latestOrderNumber", header: "Latest Order" },
    { accessorKey: "latestOrderType", header: "Type" },
    { accessorKey: "latestStatus", header: "Status" },
    {
      accessorKey: "totalAmount",
      header: "Order Value",
      meta: { align: "right" },
      cell: ({ row }) => row.original.totalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })
    }
  ], []);

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Customer Contacts</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
          A working customer-contact view derived from recent order activity. The backend does not currently expose a dedicated contact directory, so this surface groups live order customers into an actionable relationship list.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ p: 2.5 }}><Typography sx={{ fontSize: 12, color: "#64748b" }}>Customers</Typography><Typography sx={{ fontSize: "1.8rem", fontWeight: 800 }}>{rows.length}</Typography></CardContent></Card>
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={rows} emptyState="No customer contact context is available yet." /></CardContent></Card>
    </Container>
  );
}
