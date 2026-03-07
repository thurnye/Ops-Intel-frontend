import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useInventory } from "@features/inventory/hooks/useInventory";

export function InventoryItemDetailsPage() {
  const { itemId } = useParams();
  const items = useInventory();
  const item = items.find((entry) => entry.id === itemId);

  if (!item) {
    return (
      <Container>
        <Typography>Inventory item not found.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="border border-slate-200 shadow-sm">
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5">{item.sku}</Typography>
            <Typography color="text.secondary">{item.description}</Typography>
            <Typography color="text.secondary">On hand: {item.quantityOnHand}</Typography>
            <Typography color="text.secondary">Reorder point: {item.reorderPoint}</Typography>
            <Typography color="text.secondary">Location: {item.location}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
