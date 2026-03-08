import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Shipment } from "@features/shipments/types/shipments.types";
import { shipmentStatusLabel, shipmentStatusColor } from "@features/shipments/utils/shipments.utils";

type Props = { shipments: Shipment[] };

export function ShipmentsTable({ shipments }: Props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Shipment #</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Carrier</TableCell>
            <TableCell>Est. Delivery</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.map((s) => (
            <TableRow hover key={s.id}>
              <TableCell>
                <RouterLink className="font-medium text-indigo-600 no-underline hover:text-indigo-800" to={`/shipments/${s.id}`}>{s.id}</RouterLink>
              </TableCell>
              <TableCell sx={{ color: "#334155", fontWeight: 500 }}>{s.orderId}</TableCell>
              <TableCell sx={{ color: "#64748b" }}>{s.customerName}</TableCell>
              <TableCell sx={{ color: "#64748b" }}>{s.carrier}</TableCell>
              <TableCell sx={{ color: "#334155" }}>{s.estimatedDelivery}</TableCell>
              <TableCell>
                <Chip label={shipmentStatusLabel(s.status)} color={shipmentStatusColor(s.status)} size="small" variant="outlined" sx={{ height: 24 }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
