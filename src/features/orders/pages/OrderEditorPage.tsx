import { Button, Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";

export function OrderEditorPage() {
  return (
    <Container>
      <Card className="border border-slate-200 shadow-sm">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">Create / Edit Order</Typography>
            <TextField label="Customer" />
            <TextField label="Product" />
            <TextField label="Quantity" type="number" />
            <Button variant="contained">Save order</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
