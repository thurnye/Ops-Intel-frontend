import { useEffect, useMemo, useState } from "react";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import { MetricCard } from "@app/components/MetricCard";
import { ordersApi } from "@features/orders/services/orders.api.service";
import type { OrderCustomerMetricsSummary } from "@features/orders/types/orders.types";
import { orderTypeLabel, orderStatusLabel } from "@features/orders/utils/orders.utils";
import { getApiData, getErrorMessage, getPagedItems } from "@shared/utils/asyncThunk.utils";

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
  const [summary, setSummary] = useState<OrderCustomerMetricsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([ordersApi.listOrders({ pageNumber: 1, pageSize: 100 }), ordersApi.getCustomerSummary()])
      .then(([ordersResponse, summaryResponse]) => {
        const orders = getPagedItems(ordersResponse);
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
        setSummary(getApiData(summaryResponse, null));
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

  const repeatCustomers = summary?.repeatCustomers ?? rows.filter((row) => row.orderCount > 1).length;
  const totalValue = summary?.totalValue ?? rows.reduce((sum, row) => sum + row.totalAmount, 0);
  const averageCustomerValue = summary?.averageCustomerValue ?? (rows.length ? totalValue / rows.length : 0);

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Card sx={{ border: "1px solid rgba(148, 163, 184, 0.18)", background: "linear-gradient(135deg, rgba(2,132,199,0.96) 0%, rgba(15,23,42,0.96) 54%, rgba(14,165,233,0.78) 100%)", color: "white" }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(224,242,254,0.92)" }}>
                Relationship View
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.8, fontWeight: 800 }}>
                Customer Contacts
              </Typography>
              <Typography sx={{ fontSize: 14, maxWidth: 760, color: "rgba(226,232,240,0.92)", mt: 1 }}>
                A working customer-contact view derived from recent order activity. The backend does not currently expose a dedicated contact directory, so this surface groups live order customers into an actionable relationship list with order-value context.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`${repeatCustomers} repeat customers`} sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", fontWeight: 700 }} />
              <Chip label={totalValue.toLocaleString("en-US", { style: "currency", currency: "USD" }) + " in order value"} sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
              <Chip label="Derived from live orders" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Customers" value={summary?.totalCustomers ?? rows.length} icon={<GroupsOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Distinct customer groupings inferred from all orders in the database." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Repeat Customers" value={repeatCustomers} tone="#0284c7" icon={<RepeatOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Customers with more than one order across the full order dataset." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Total Value" value={totalValue.toLocaleString("en-US", { style: "currency", currency: "USD" })} tone="#16a34a" icon={<CurrencyExchangeOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Combined order value represented by the grouped customer set." />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <MetricCard label="Avg. Value" value={averageCustomerValue.toLocaleString("en-US", { style: "currency", currency: "USD" })} tone="#7c3aed" icon={<SavingsOutlinedIcon sx={{ fontSize: 18 }} />} helpText="Average order value concentration per customer grouping." />
        </Grid>
      </Grid>
      <Card><CardContent sx={{ p: 2 }}><AppDataTable columns={columns} data={rows} emptyState="No customer contact context is available yet." /></CardContent></Card>
    </Container>
  );
}
