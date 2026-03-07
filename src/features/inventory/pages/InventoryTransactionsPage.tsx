import { Card, CardContent, Container, List, ListItem, Typography } from "@mui/material";

const mockTransactions = [
  "+120 ALU-6061-BAR received from supplier",
  "-80 ALU-7005-TUBE reserved for SO-1025",
  "+40 ALU-7005-TUBE moved to finished goods"
];

export function InventoryTransactionsPage() {
  return (
    <Container>
      <Card className="border border-slate-200 shadow-sm">
        <CardContent>
          <Typography gutterBottom variant="h5">
            Stock Movements / Transactions
          </Typography>
          <List dense>
            {mockTransactions.map((line) => (
              <ListItem className="!px-0" key={line}>
                <Typography variant="body2">{line}</Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}
