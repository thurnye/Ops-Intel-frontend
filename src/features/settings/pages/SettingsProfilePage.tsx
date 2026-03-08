import { Box, Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";
import { useSettings } from "@features/settings/hooks/useSettings";

export function SettingsProfilePage() {
  const { profile } = useSettings();
  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">My Profile</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Manage your account information</Typography>
      </Box>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3} maxWidth={480}>
            <TextField label="Name" value={profile.name} fullWidth size="small" slotProps={{ input: { readOnly: true } }} />
            <TextField label="Email" value={profile.email} fullWidth size="small" slotProps={{ input: { readOnly: true } }} />
            <TextField label="Department" value={profile.department} fullWidth size="small" slotProps={{ input: { readOnly: true } }} />
            <TextField label="Timezone" value={profile.timezone} fullWidth size="small" slotProps={{ input: { readOnly: true } }} />
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
