import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { statusLabel } from "@features/orders/utils/orders.utils";
import type { SalesOrder } from "@features/orders/types/orders.types";

type Props = {
  orders: SalesOrder[];
};

export function OrdersTable({ orders }: Props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order #</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Product</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow hover key={order.id} sx={{ "&:hover": { cursor: "pointer" } }}>
              <TableCell>
                <RouterLink className="font-medium text-indigo-600 no-underline hover:text-indigo-800" to={`/orders/${order.id}`}>
                  {order.id}
                </RouterLink>
              </TableCell>
              <TableCell sx={{ color: "#334155", fontWeight: 500 }}>{order.customerName}</TableCell>
              <TableCell sx={{ color: "#64748b" }}>{order.product}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: "#334155" }}>{order.quantity}</TableCell>
              <TableCell>
                <Chip label={statusLabel(order.status)} size="small" variant="outlined" sx={{ height: 24 }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
