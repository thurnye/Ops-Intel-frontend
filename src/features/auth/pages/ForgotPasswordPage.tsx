import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

export function ForgotPasswordPage() {
  return (
    <Card className="mx-auto mt-20 max-w-md border border-slate-200 shadow-lg">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">Forgot password</Typography>
          <TextField fullWidth label="Work email" />
          <Button variant="contained">Send reset link</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
