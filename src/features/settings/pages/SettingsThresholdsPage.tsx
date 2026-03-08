import { Box, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useSettings } from "@features/settings/hooks/useSettings";

export function SettingsThresholdsPage() {
  const { thresholds } = useSettings();
  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Thresholds</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Configure operational alert thresholds</Typography>
      </Box>
      <Stack spacing={1.5}>
        {thresholds.map((t) => (
          <Card key={t.id}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{t.label}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#6366f1" }}>{t.value} {t.unit}</Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
