import { Box, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import type { ProductionOrderSummary } from "@features/production/types/production.types";
import { orderStatusLabel, orderStatusColor, priorityLabel, priorityColor, progressPercent, formatDate } from "@features/production/utils/production.utils";
import { useNavigate } from "react-router-dom";

type Props = {
  orders: ProductionOrderSummary[];
};

export function ProductionBoard({ orders }: Props) {
  const navigate = useNavigate();

  return (
    <Stack spacing={1.5}>
      {orders.map((order) => {
        const pct = progressPercent(order);
        return (
          <Card
            key={order.id}
            sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f8fafc" } }}
            onClick={() => navigate(order.id)}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{order.productionOrderNumber}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#64748b" }}>{order.productName}</Typography>
                  </Box>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Chip
                      label={priorityLabel(order.priority)}
                      size="small"
                      variant="outlined"
                      sx={{ height: 22, fontSize: 11, borderColor: priorityColor(order.priority), color: priorityColor(order.priority) }}
                    />
                    <Chip
                      label={orderStatusLabel(order.status)}
                      size="small"
                      sx={{ height: 22, fontSize: 11, bgcolor: orderStatusColor(order.status) + "18", color: orderStatusColor(order.status), fontWeight: 600 }}
                    />
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={3}>
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                    SKU: <Box component="span" sx={{ fontWeight: 600, color: "#334155" }}>{order.productSku}</Box>
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                    Warehouse: <Box component="span" sx={{ fontWeight: 600, color: "#334155" }}>{order.warehouseName}</Box>
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                    Due: <Box component="span" sx={{ fontWeight: 600, color: "#334155" }}>{formatDate(order.plannedEndDate)}</Box>
                  </Typography>
                </Stack>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                      {order.producedQuantity} / {order.plannedQuantity} {order.unitOfMeasureName}
                    </Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#334155" }}>{pct}%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{ height: 6, borderRadius: 3, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { borderRadius: 3 } }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
