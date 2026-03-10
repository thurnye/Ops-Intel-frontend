import {
  Box, Card, CardContent, Chip, Container, Grid, LinearProgress,
  Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography
} from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/hooks/app.hooks";
import { useProductionOrderDetail } from "@features/production/hooks/useProduction";
import { fetchProductionOrderById } from "@features/production/redux/production.thunks";
import {
  orderStatusLabel, orderStatusColor, priorityLabel, priorityColor,
  executionStatusLabel, executionStatusColor, sourceTypeLabel,
  scrapReasonLabel, qcTypeLabel, qcStatusLabel, qcStatusColor,
  progressPercent, formatCurrency, formatDate
} from "@features/production/utils/production.utils";

export function ProductionJobDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const order = useProductionOrderDetail(orderId);
  const { detailLoading } = useAppSelector((state) => state.production);

  useEffect(() => {
    if (orderId && !order) {
      void dispatch(fetchProductionOrderById(orderId));
    }
  }, [dispatch, order, orderId]);

  if (detailLoading && !order) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography variant="h6" color="text.secondary">Loading production order...</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography variant="h6" color="text.secondary">Production order not found</Typography>
      </Container>
    );
  }

  const pct = progressPercent(order);

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
        <Typography variant="h4">{order.productionOrderNumber}</Typography>
        <Chip
          label={orderStatusLabel(order.status)}
          size="small"
          sx={{ bgcolor: orderStatusColor(order.status) + "18", color: orderStatusColor(order.status), fontWeight: 600 }}
        />
        <Chip
          label={priorityLabel(order.priority)}
          size="small"
          variant="outlined"
          sx={{ borderColor: priorityColor(order.priority), color: priorityColor(order.priority) }}
        />
      </Stack>

      {/* Quick info cards */}
      <Grid container spacing={2.5}>
        {[
          { label: "Product", value: `${order.productName} (${order.productSku})` },
          { label: "Source", value: sourceTypeLabel(order.sourceType) + (order.sourceReferenceId ? ` — ${order.sourceReferenceId}` : "") },
          { label: "Warehouse", value: order.warehouseName },
          { label: "BOM", value: order.billOfMaterialName ?? "—" },
          { label: "Routing", value: order.routingName ?? "—" },
          { label: "Batch", value: order.batchNumber ?? "—" },
          { label: "Planned Start", value: formatDate(order.plannedStartDate) },
          { label: "Planned End", value: formatDate(order.plannedEndDate) },
          { label: "Actual Start", value: order.actualStartDate ? formatDate(order.actualStartDate) : "—" }
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 6, md: 4 }}>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#64748b", mb: 0.25 }}>{item.label}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{item.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Progress */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>Production Progress</Typography>
          <Stack direction="row" spacing={4} mb={2}>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#64748b" }}>Planned</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{order.plannedQuantity} {order.unitOfMeasureName}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#64748b" }}>Produced</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#10b981" }}>{order.producedQuantity}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#64748b" }}>Remaining</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#f59e0b" }}>{order.remainingQuantity}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, color: "#64748b" }}>Scrap</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#ef4444" }}>{order.scrapQuantity ?? 0}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>Completion</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{pct}%</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{ height: 8, borderRadius: 4, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { borderRadius: 4 } }}
          />
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Cost Summary</Typography>
          <Grid container spacing={3}>
            {[
              { label: "Material", estimated: order.estimatedMaterialCost, actual: order.actualMaterialCost },
              { label: "Labor", estimated: order.estimatedLaborCost, actual: order.actualLaborCost },
              { label: "Overhead", estimated: order.estimatedOverheadCost, actual: order.actualOverheadCost }
            ].map((c) => (
              <Grid key={c.label} size={{ xs: 12, md: 4 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>{c.label}</Typography>
                <Stack direction="row" spacing={3}>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Estimated</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{c.estimated != null ? formatCurrency(c.estimated) : "—"}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Actual</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#10b981" }}>{c.actual != null ? formatCurrency(c.actual) : "—"}</Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Executions */}
      {order.executions && order.executions.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Executions</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Operation</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Work Center</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Machine</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Completed</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Scrap</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.executions.map((ex) => (
                    <TableRow key={ex.id}>
                      <TableCell sx={{ fontSize: 13 }}>{ex.operationName} ({ex.operationCode})</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{ex.workCenterName}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{ex.machineName}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{ex.completedQuantity} / {ex.plannedQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13, color: "#ef4444" }} align="right">{ex.scrapQuantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={executionStatusLabel(ex.status)}
                          size="small"
                          sx={{ height: 22, fontSize: 11, bgcolor: executionStatusColor(ex.status) + "18", color: executionStatusColor(ex.status), fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Material Issues */}
      {order.materialIssues && order.materialIssues.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Material Issues</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Material</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Batch</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Planned</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Issued</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Returned</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Unit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.materialIssues.map((mi) => (
                    <TableRow key={mi.id}>
                      <TableCell sx={{ fontSize: 13 }}>{mi.materialProductName} ({mi.materialProductSku})</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{mi.batchNumber ?? "—"}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{mi.plannedQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{mi.issuedQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{mi.returnedQuantity}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{mi.unitOfMeasureName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Outputs */}
      {order.outputs && order.outputs.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Outputs</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Batch</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Final</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.outputs.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell sx={{ fontSize: 13 }}>{o.productName} ({o.productSku})</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{o.batchNumber ?? "—"}</TableCell>
                      <TableCell sx={{ fontSize: 13 }} align="right">{o.quantityProduced}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{o.unitOfMeasureName}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{formatDate(o.outputDate)}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{o.isFinalOutput ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Scraps */}
      {order.scraps && order.scraps.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Scraps</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Reason</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Qty</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Reworkable</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.scraps.map((sc) => (
                    <TableRow key={sc.id}>
                      <TableCell sx={{ fontSize: 13 }}>{sc.productName}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{scrapReasonLabel(sc.reason)}{sc.reasonDescription ? ` — ${sc.reasonDescription}` : ""}</TableCell>
                      <TableCell sx={{ fontSize: 13, color: "#ef4444" }} align="right">{sc.scrapQuantity} {sc.unitOfMeasureName}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{formatDate(sc.scrapDate)}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{sc.isReworkable ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Quality Checks */}
      {order.qualityChecks && order.qualityChecks.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Quality Checks</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Inspector</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Standard</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Findings</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.qualityChecks.map((qc) => (
                    <TableRow key={qc.id}>
                      <TableCell sx={{ fontSize: 13 }}>{qcTypeLabel(qc.checkType)}</TableCell>
                      <TableCell>
                        <Chip
                          label={qcStatusLabel(qc.status)}
                          size="small"
                          sx={{ height: 22, fontSize: 11, bgcolor: qcStatusColor(qc.status) + "18", color: qcStatusColor(qc.status), fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{qc.checkedByUserName ?? "—"}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{qc.referenceStandard ?? "—"}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{qc.findings ?? "—"}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{formatDate(qc.checkDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {order.notes && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>Notes</Typography>
            <Typography sx={{ fontSize: 13, color: "#475569", whiteSpace: "pre-wrap" }}>{order.notes}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
