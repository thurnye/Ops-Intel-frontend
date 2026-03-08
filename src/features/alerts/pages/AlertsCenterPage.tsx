import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { AlertsList } from "@features/alerts/components/AlertsList";
import { useAlerts } from "@features/alerts/hooks/useAlerts";
import { useAppDispatch } from "@app/hooks/app.hooks";
import { resolveAlert } from "@features/alerts/redux/slices/alerts.slice";

export function AlertsCenterPage() {
  const dispatch = useAppDispatch();
  const { alerts, filteredAlerts, unreadCount } = useAlerts();
  const critical = alerts.filter((a) => !a.isResolved && (a.severity === "critical" || a.severity === "high")).length;
  const active = alerts.filter((a) => !a.isResolved).length;

  const stats = [
    { label: "Unread", value: unreadCount, color: "#6366f1" },
    { label: "Critical/High", value: critical, color: "#ef4444" },
    { label: "Active", value: active, color: "#f59e0b" },
    { label: "Total", value: alerts.length, color: "#64748b" }
  ];

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Alerts</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Operational exceptions requiring attention</Typography>
      </Box>
      <Grid container spacing={2.5}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card><CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#64748b", mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <AlertsList alerts={filteredAlerts} onResolve={(id) => dispatch(resolveAlert(id))} />
    </Container>
  );
}
