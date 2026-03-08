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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink } from "react-router-dom";
import { useStockMovements } from "@features/inventory/hooks/useInventory";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { setMovementFilters } from "@features/inventory/redux/slices/inventory.slice";
import { movementTypeLabel, movementTypeColor } from "@features/inventory/utils/inventory.utils";

export function InventoryTransactionsPage() {
  const dispatch = useAppDispatch();
  const { movements, filters } = useStockMovements();

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Box>
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to="/inventory">
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back to Inventory
        </RouterLink>
        <Typography variant="h4" mt={1}>Stock Movements</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Track all stock-in, stock-out and adjustment history</Typography>
      </Box>

      <Card>
        <Box className="p-4 pb-0">
          <TextField
            fullWidth
            placeholder="Search by product or reference number..."
            size="small"
            value={filters.query}
            onChange={(e) => dispatch(setMovementFilters({ query: e.target.value }))}
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
                <TableCell>Date</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Before</TableCell>
                <TableCell align="right">After</TableCell>
                <TableCell>Reference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: "#475569" }}>
                      {new Date(m.movementDateUtc).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RouterLink className="text-sm font-medium text-indigo-600 no-underline hover:text-indigo-800" to={`/inventory/${m.productId}`}>
                      {m.productName}
                    </RouterLink>
                  </TableCell>
                  <TableCell>{m.warehouseName}</TableCell>
                  <TableCell>
                    <Chip
                      label={movementTypeLabel(m.movementType)}
                      size="small"
                      sx={{ fontSize: 11, fontWeight: 600, bgcolor: `${movementTypeColor(m.movementType)}18`, color: movementTypeColor(m.movementType) }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{m.quantity}</TableCell>
                  <TableCell align="right" sx={{ color: "#94a3b8" }}>{m.quantityBefore}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{m.quantityAfter}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontFamily: "monospace", color: "#64748b" }}>
                      {m.referenceNumber ?? "—"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: "#94a3b8" }}>
                    No movements match your search.
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
