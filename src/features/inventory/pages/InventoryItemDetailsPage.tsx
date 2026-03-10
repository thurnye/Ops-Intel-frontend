import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/hooks/app.hooks";
import { useProductById } from "@features/inventory/hooks/useInventory";
import { fetchInventoryProductById } from "@features/inventory/redux/inventory.thunks";
import { productStatusLabel, productStatusColor, formatCurrency, totalOnHand, totalAvailable } from "@features/inventory/utils/inventory.utils";

export function InventoryItemDetailsPage() {
  const { itemId } = useParams();
  const dispatch = useAppDispatch();
  const product = useProductById(itemId);
  const { detailLoading } = useAppSelector((state) => state.inventory);

  useEffect(() => {
    if (itemId && !product) {
      void dispatch(fetchInventoryProductById(itemId));
    }
  }, [dispatch, itemId, product]);

  if (detailLoading && !product) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography sx={{ color: "#64748b" }}>Loading product...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth={false} disableGutters>
        <Typography sx={{ color: "#64748b" }}>Product not found.</Typography>
      </Container>
    );
  }

  const onHand = totalOnHand(product);
  const available = totalAvailable(product);

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      {/* Header */}
      <Box>
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to="/inventory">
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back to Inventory
        </RouterLink>
        <Stack direction="row" alignItems="center" spacing={2} mt={1}>
          <Typography variant="h4">{product.name}</Typography>
          <Chip
            label={productStatusLabel(product.status)}
            size="small"
            sx={{ fontSize: 11, fontWeight: 600, bgcolor: `${productStatusColor(product.status)}18`, color: productStatusColor(product.status) }}
          />
        </Stack>
        {product.description && (
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>{product.description}</Typography>
        )}
      </Box>

      {/* Quick stats */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {[
          { label: "SKU", value: product.sku },
          { label: "Category", value: product.categoryName },
          { label: "Brand", value: product.brandName ?? "—" },
          { label: "Unit", value: product.unitOfMeasureName }
        ].map((s) => (
          <Card key={s.label} className="flex-1">
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mt: 0.25 }}>{s.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Pricing & Inventory */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Card className="flex-1">
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mb: 2 }}>Pricing</Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Cost Price</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{formatCurrency(product.costPrice)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Selling Price</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{formatCurrency(product.sellingPrice)}</Typography>
              </Stack>
              {product.taxRate > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: 13, color: "#64748b" }}>Tax Rate</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{product.taxRate}%</Typography>
                </Stack>
              )}
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Margin</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>
                  {((product.sellingPrice - product.costPrice) / product.sellingPrice * 100).toFixed(1)}%
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mb: 2 }}>Stock Summary</Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Total On Hand</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{onHand.toLocaleString()}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Available</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{available.toLocaleString()}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Reorder Level</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{product.reorderLevel}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Reorder Qty</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{product.reorderQuantity}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Stock by warehouse */}
      {product.inventoryStocks.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mb: 2 }}>Stock by Warehouse</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Warehouse</TableCell>
                    <TableCell align="right">On Hand</TableCell>
                    <TableCell align="right">Reserved</TableCell>
                    <TableCell align="right">Available</TableCell>
                    <TableCell align="right">Damaged</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {product.inventoryStocks.map((stk) => (
                    <TableRow key={stk.id}>
                      <TableCell>{stk.warehouseName}</TableCell>
                      <TableCell align="right">{stk.quantityOnHand.toLocaleString()}</TableCell>
                      <TableCell align="right">{stk.quantityReserved.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{stk.quantityAvailable.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ color: stk.quantityDamaged > 0 ? "#ef4444" : "#94a3b8" }}>
                        {stk.quantityDamaged}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Product flags */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a", mb: 2 }}>Product Attributes</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {product.trackInventory && <Chip label="Track Inventory" size="small" variant="outlined" />}
            {product.allowBackOrder && <Chip label="Allow Back-order" size="small" variant="outlined" />}
            {product.isSerialized && <Chip label="Serialized" size="small" variant="outlined" />}
            {product.isBatchTracked && <Chip label="Batch Tracked" size="small" variant="outlined" />}
            {product.isPerishable && <Chip label="Perishable" size="small" variant="outlined" />}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
