import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink } from "react-router-dom";

export function OrderEditorPage() {
  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Box>
        <RouterLink className="mb-2 inline-flex items-center gap-1 text-sm text-indigo-600 no-underline hover:text-indigo-800" to="/orders">
          <ArrowBackIcon sx={{ fontSize: 14 }} /> Back to Orders
        </RouterLink>
        <Typography variant="h4" mt={1}>New Order</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Create a new sales or purchase order</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3} maxWidth={480}>
            <TextField label="Customer Name" fullWidth size="small" />
            <TextField label="Reference Number" fullWidth size="small" />
            <TextField label="Notes" fullWidth size="small" multiline rows={3} />
            <Button variant="contained" sx={{ alignSelf: "flex-start" }}>Save Order</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
