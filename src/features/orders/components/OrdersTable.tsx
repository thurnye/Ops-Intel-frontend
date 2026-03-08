import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { OrderListItem } from "@features/orders/types/orders.types";
import { orderStatusLabel, orderStatusColor, paymentStatusLabel, paymentStatusColor, orderTypeLabel, formatCurrency, formatDate } from "@features/orders/utils/orders.utils";

type Props = {
  orders: OrderListItem[];
};

export function OrdersTable({ orders }: Props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order #</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Payment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((o) => (
            <TableRow hover key={o.id}>
              <TableCell>
                <RouterLink className="font-medium text-indigo-600 no-underline hover:text-indigo-800" to={`/orders/${o.id}`}>
                  {o.orderNumber}
                </RouterLink>
              </TableCell>
              <TableCell sx={{ color: "#334155", fontWeight: 500 }}>{o.customerName ?? "—"}</TableCell>
              <TableCell>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>{orderTypeLabel(o.orderType)}</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>{formatDate(o.orderDateUtc)}</Typography>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: "#0f172a" }}>
                {formatCurrency(o.totalAmount)}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={orderStatusLabel(o.status)}
                  size="small"
                  sx={{ fontSize: 11, fontWeight: 600, bgcolor: `${orderStatusColor(o.status)}18`, color: orderStatusColor(o.status) }}
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={paymentStatusLabel(o.paymentStatus)}
                  size="small"
                  sx={{ fontSize: 11, fontWeight: 600, bgcolor: `${paymentStatusColor(o.paymentStatus)}18`, color: paymentStatusColor(o.paymentStatus) }}
                />
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#94a3b8" }}>
                No orders match your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
