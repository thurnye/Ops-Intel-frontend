import { Box, Card, CardContent, Container, List, ListItem, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useInventory } from "@features/inventory/hooks/useInventory";
import { InventorySummaryCard } from "@features/inventory/components/InventorySummaryCard";

export function InventoryOverviewPage() {
  const items = useInventory();

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2}>
        <Box>
          <Typography variant="h4">Inventory</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
            Track stock levels and movements
          </Typography>
        </Box>
        <RouterLink
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 no-underline transition-colors hover:text-indigo-800"
          to="/inventory/transactions"
        >
          View stock movements
          <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </RouterLink>
      </Stack>

      <InventorySummaryCard totalItems={items.length} />

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Inventory Items</Typography>
          <List disablePadding>
            {items.map((item) => (
              <ListItem
                key={item.id}
                className="!rounded-lg !px-3 !py-3"
                sx={{ "&:not(:last-child)": { mb: 0.5 }, "&:hover": { bgcolor: "#f8fafc" } }}
              >
                <Stack spacing={0.5} className="w-full">
                  <RouterLink className="font-medium text-indigo-600 no-underline hover:text-indigo-800" to={`/inventory/${item.id}`}>
                    {item.sku} — {item.description}
                  </RouterLink>
                  <Stack direction="row" spacing={3}>
                    <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                      On hand: <Box component="span" sx={{ fontWeight: 600, color: "#334155" }}>{item.quantityOnHand}</Box>
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                      Reorder: <Box component="span" sx={{ fontWeight: 600, color: "#334155" }}>{item.reorderPoint}</Box>
                    </Typography>
                  </Stack>
                </Stack>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}
