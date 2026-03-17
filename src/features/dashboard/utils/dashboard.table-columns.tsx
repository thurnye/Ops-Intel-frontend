import { Chip, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import type { DashboardOrderRow, DashboardStockRow } from "@features/dashboard/types/dashboard.types";
import { formatDashboardCurrency, getDashboardStatusChipColor } from "@features/dashboard/utils/dashboard.utils";

export function createDashboardOrderColumns(): ColumnDef<DashboardOrderRow>[] {
  return [
    {
      header: "Order No",
      accessorKey: "orderNo",
      cell: (info) => <Typography fontWeight={700}>{info.getValue() as string}</Typography>,
    },
    { header: "Customer", accessorKey: "customer" },
    { header: "Module", accessorKey: "module" },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (info) => formatDashboardCurrency(info.getValue() as number),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => (
        <Chip
          label={info.getValue() as string}
          size="small"
          color={getDashboardStatusChipColor(info.getValue() as string)}
          variant="outlined"
        />
      ),
    },
    { header: "Due Date", accessorKey: "dueDate" },
    { header: "Warehouse", accessorKey: "warehouse" },
  ];
}

export function createDashboardStockColumns(): ColumnDef<DashboardStockRow>[] {
  return [
    {
      header: "SKU",
      accessorKey: "sku",
      cell: (info) => <Typography fontWeight={700}>{info.getValue() as string}</Typography>,
    },
    { header: "Item", accessorKey: "item" },
    { header: "Warehouse", accessorKey: "warehouse" },
    { header: "Stock", accessorKey: "stock" },
    { header: "Reorder Level", accessorKey: "reorderLevel" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => (
        <Chip
          label={info.getValue() as string}
          size="small"
          color={getDashboardStatusChipColor(info.getValue() as string)}
          variant="outlined"
        />
      ),
    },
  ];
}
