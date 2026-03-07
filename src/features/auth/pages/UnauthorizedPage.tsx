import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <Card className="mx-auto mt-20 max-w-md border border-slate-200 shadow-lg">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">Access denied</Typography>
          <Typography color="text.secondary" variant="body2">
            You do not have permission to access this area.
          </Typography>
          <Button component={RouterLink} to="/dashboard" variant="contained">
            Back to dashboard
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
