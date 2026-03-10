import { useMemo } from "react";
import { Chip, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import type { OrderListItem } from "@features/orders/types/orders.types";
import {
  formatCurrency,
  formatDate,
  orderStatusColor,
  orderStatusLabel,
  orderTypeLabel,
  paymentStatusColor,
  paymentStatusLabel
} from "@features/orders/utils/orders.utils";

type Props = {
  orders: OrderListItem[];
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function OrdersTable({ orders, page, pageSize, totalRows, onPageChange, onPageSizeChange }: Props) {
  const columns = useMemo<AppDataTableColumnDef<OrderListItem>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order #",
        cell: ({ row }) => (
          <RouterLink className="font-medium text-indigo-600 no-underline hover:text-indigo-800" to={`/orders/${row.original.id}`}>
            {row.original.orderNumber}
          </RouterLink>
        )
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => (
          <Typography sx={{ color: "#334155", fontWeight: 600, fontSize: 13 }}>
            {row.original.customerName ?? "Walk-in / Internal"}
          </Typography>
        )
      },
      {
        accessorKey: "orderType",
        header: "Type",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>
            {orderTypeLabel(row.original.orderType)}
          </Typography>
        )
      },
      {
        accessorKey: "orderDateUtc",
        header: "Date",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>
            {formatDate(row.original.orderDateUtc)}
          </Typography>
        )
      },
      {
        accessorKey: "totalAmount",
        header: "Total",
        meta: { align: "right" },
        cell: ({ row }) => (
          <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
            {formatCurrency(row.original.totalAmount)}
          </Typography>
        )
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { align: "center" },
        cell: ({ row }) => (
          <Chip
            label={orderStatusLabel(row.original.status)}
            size="small"
            sx={{
              fontSize: 11,
              fontWeight: 700,
              bgcolor: `${orderStatusColor(row.original.status)}18`,
              color: orderStatusColor(row.original.status)
            }}
          />
        )
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        meta: { align: "center" },
        cell: ({ row }) => (
          <Chip
            label={paymentStatusLabel(row.original.paymentStatus)}
            size="small"
            sx={{
              fontSize: 11,
              fontWeight: 700,
              bgcolor: `${paymentStatusColor(row.original.paymentStatus)}18`,
              color: paymentStatusColor(row.original.paymentStatus)
            }}
          />
        )
      }
    ],
    []
  );

  return (
    <AppDataTable
      columns={columns}
      data={orders}
      emptyState="No orders match your search."
      manualPagination
      pageIndex={page - 1}
      pageSize={pageSize}
      totalRows={totalRows}
      onPageChange={(pageIndex) => onPageChange(pageIndex + 1)}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
