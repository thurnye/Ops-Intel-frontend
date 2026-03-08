import { Box, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@app/hooks/app.hooks";
import { severityColor, severityLabel, timeAgo } from "@features/alerts/utils/alerts.utils";

export function AlertDetailsPage() {
  const { alertId } = useParams<{ alertId: string }>();
  const alert = useAppSelector((s) => s.alerts.alerts.find((a) => a.id === alertId));

  if (!alert) return <Typography variant="h6" color="text.secondary">Alert not found</Typography>;

  return (
    <Container maxWidth={false} disableGutters className="space-y-5">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h4">{alert.id}</Typography>
        <Chip label={severityLabel(alert.severity)} color={severityColor(alert.severity)} size="small" />
        {alert.isResolved && <Chip label="Resolved" color="success" size="small" variant="outlined" />}
      </Stack>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{alert.title}</Typography>
            <Typography sx={{ fontSize: 14, color: "#64748b" }}>{alert.description}</Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              {[
                { label: "Category", value: alert.category },
                { label: "Source", value: alert.source },
                { label: "Created", value: timeAgo(alert.createdAt) },
                { label: "Status", value: alert.isResolved ? "Resolved" : alert.isRead ? "Read" : "Unread" }
              ].map((f) => (
                <Box key={f.label}>
                  <Typography sx={{ fontSize: 12, color: "#94a3b8", mb: 0.25 }}>{f.label}</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{f.value}</Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
