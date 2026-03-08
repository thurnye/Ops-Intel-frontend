import {
  Box,
  Card,
  Chip,
  Container,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Link as RouterLink } from "react-router-dom";
import { useInventory } from "@features/inventory/hooks/useInventory";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { setProductFilters } from "@features/inventory/redux/slices/inventory.slice";
import { InventorySummaryCards } from "@features/inventory/components/InventorySummaryCard";
import { computeStockSummary } from "@features/inventory/mock/inventory.mock";
import { productStatusLabel, productStatusColor, formatCurrency, totalOnHand, isLowStock } from "@features/inventory/utils/inventory.utils";

export function InventoryOverviewPage() {
  const dispatch = useAppDispatch();
  const { products, allProducts, filters } = useInventory();
  const summary = computeStockSummary(allProducts);

  const stats = [
    { label: "Products", value: allProducts.length, color: "#6366f1" },
    { label: "Total On Hand", value: summary.totalOnHand.toLocaleString(), color: "#10b981" },
    { label: "Available", value: summary.totalAvailable.toLocaleString(), color: "#3b82f6" },
    { label: "Low Stock", value: summary.lowStockCount, color: summary.lowStockCount > 0 ? "#f59e0b" : "#94a3b8" }
  ];

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
        <Box>
          <Typography variant="h4">Inventory</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
            Products, stock levels and movements
          </Typography>
        </Box>
        <RouterLink
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 no-underline transition-colors hover:text-indigo-800"
          to="/inventory/movements"
        >
          View stock movements &rarr;
        </RouterLink>
      </Stack>

      <InventorySummaryCards stats={stats} />

      <Card>
        <Box className="p-4 pb-0">
          <TextField
            fullWidth
            placeholder="Search by name, SKU or barcode..."
            size="small"
            value={filters.query}
            onChange={(e) => dispatch(setProductFilters({ query: e.target.value }))}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                )
              }
            }}
          />
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">On Hand</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => {
                const low = isLowStock(p);
                return (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <RouterLink className="font-medium text-indigo-600 no-underline hover:text-indigo-800" to={`/inventory/${p.id}`}>
                        {p.name}
                      </RouterLink>
                      {low && <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: "#f59e0b", ml: 0.5, verticalAlign: "text-bottom" }} />}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, fontFamily: "monospace", color: "#475569" }}>{p.sku}</Typography>
                    </TableCell>
                    <TableCell>{p.categoryName}</TableCell>
                    <TableCell>{p.brandName ?? "—"}</TableCell>
                    <TableCell align="right">{formatCurrency(p.sellingPrice)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: low ? "#f59e0b" : "#0f172a" }}>
                      {totalOnHand(p).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={productStatusLabel(p.status)}
                        size="small"
                        sx={{ fontSize: 11, fontWeight: 600, bgcolor: `${productStatusColor(p.status)}18`, color: productStatusColor(p.status) }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#94a3b8" }}>
                    No products match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
}
