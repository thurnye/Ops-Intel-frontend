import { Box, Card, CardContent, Container, Stack, Switch, Typography } from "@mui/material";
import { useSettings } from "@features/settings/hooks/useSettings";
import { notificationLabel } from "@features/settings/utils/settings.utils";

export function SettingsPreferencesPage() {
  const { preferences } = useSettings();
  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Preferences</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Customize your workspace experience</Typography>
      </Box>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Notifications</Typography>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>{notificationLabel(preferences.notifications)}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Compact Mode</Typography>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Use a more condensed layout</Typography>
              </Box>
              <Switch checked={preferences.compactMode} disabled />
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Default Landing Page</Typography>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>{preferences.dashboardDefault === "overview" ? "Dashboard Overview" : "Analytics"}</Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
