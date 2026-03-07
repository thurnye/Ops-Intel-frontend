import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

export function ResetPasswordPage() {
  return (
    <Card className="mx-auto mt-20 max-w-md border border-slate-200 shadow-lg">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">Reset password</Typography>
          <TextField fullWidth label="New password" type="password" />
          <TextField fullWidth label="Confirm password" type="password" />
          <Button variant="contained">Update password</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
