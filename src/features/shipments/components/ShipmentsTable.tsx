import { useMemo } from "react";
import { Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { AppDataTableColumnDef } from "@app/components/AppDataTable";
import { AppDataTable } from "@app/components/AppDataTable";
import type { ShipmentListItem } from "@features/shipments/types/shipments.types";
import {
  formatDate,
  formatWeight,
  shipmentPriorityColor,
  shipmentPriorityLabel,
  shipmentStatusColor,
  shipmentStatusLabel,
  shipmentTypeLabel
} from "@features/shipments/utils/shipments.utils";

type Props = {
  shipments: ShipmentListItem[];
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function ShipmentsTable({ shipments, page, pageSize, totalRows, onPageChange, onPageSizeChange }: Props) {
  const navigate = useNavigate();

  const columns = useMemo<AppDataTableColumnDef<ShipmentListItem>[]>(
    () => [
      {
        accessorKey: "shipmentNumber",
        header: "Shipment #",
        cell: ({ row }) => (
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#4338ca" }}>
            {row.original.shipmentNumber}
          </Typography>
        )
      },
      {
        accessorKey: "orderNumber",
        header: "Order",
        cell: ({ row }) => row.original.orderNumber ?? "—"
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => shipmentTypeLabel(row.original.type)
      },
      {
        accessorKey: "carrierName",
        header: "Carrier",
        cell: ({ row }) => row.original.carrierName ?? "—"
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <Chip
            label={shipmentPriorityLabel(row.original.priority)}
            size="small"
            variant="outlined"
            sx={{
              height: 22,
              fontSize: 11,
              borderColor: shipmentPriorityColor(row.original.priority),
              color: shipmentPriorityColor(row.original.priority)
            }}
          />
        )
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Chip
            label={shipmentStatusLabel(row.original.status)}
            size="small"
            sx={{
              height: 22,
              fontSize: 11,
              bgcolor: `${shipmentStatusColor(row.original.status)}18`,
              color: shipmentStatusColor(row.original.status),
              fontWeight: 700
            }}
          />
        )
      },
      {
        accessorKey: "totalPackages",
        header: "Packages",
        meta: { align: "right" },
        cell: ({ row }) => row.original.totalPackages
      },
      {
        accessorKey: "totalWeight",
        header: "Weight",
        meta: { align: "right" },
        cell: ({ row }) => formatWeight(row.original.totalWeight)
      },
      {
        accessorKey: "plannedShipDateUtc",
        header: "Ship Date",
        cell: ({ row }) => (row.original.plannedShipDateUtc ? formatDate(row.original.plannedShipDateUtc) : "—")
      },
      {
        accessorKey: "plannedDeliveryDateUtc",
        header: "Est. Delivery",
        cell: ({ row }) => (row.original.plannedDeliveryDateUtc ? formatDate(row.original.plannedDeliveryDateUtc) : "—")
      }
    ],
    []
  );

  return (
    <AppDataTable
      columns={columns}
      data={shipments}
      emptyState="No shipments found."
      initialPageSize={10}
      onRowClick={(shipment) => navigate(shipment.id)}
      leadingToolbarSlot={
        shipments.some((shipment) => shipment.isCrossBorder) ? (
          <Chip
            label={`${shipments.filter((shipment) => shipment.isCrossBorder).length} cross-border`}
            size="small"
            sx={{ bgcolor: "#dbeafe", color: "#1d4ed8", fontWeight: 700 }}
          />
        ) : null
      }
      pageIndex={page - 1}
      pageSize={pageSize}
      totalRows={totalRows}
      manualPagination
      onPageChange={(pageIndex) => onPageChange(pageIndex + 1)}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
