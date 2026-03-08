import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { Alert } from "@features/alerts/types/alerts.types";
import { severityColor, severityLabel, timeAgo } from "@features/alerts/utils/alerts.utils";

type Props = { alerts: Alert[]; onResolve: (id: string) => void };

export function AlertsList({ alerts, onResolve }: Props) {
  if (alerts.length === 0) {
    return <Card><CardContent sx={{ p: 4, textAlign: "center" }}><Typography sx={{ color: "#94a3b8" }}>No alerts to display</Typography></CardContent></Card>;
  }

  return (
    <Stack spacing={1.5}>
      {alerts.map((alert) => (
        <Card key={alert.id} sx={{ opacity: alert.isResolved ? 0.6 : 1 }}>
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box className="flex-1">
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  {!alert.isRead && <Box className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />}
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{alert.title}</Typography>
                  <Chip label={severityLabel(alert.severity)} color={severityColor(alert.severity)} size="small" variant="outlined" sx={{ height: 20, fontSize: 10 }} />
                </Stack>
                <Typography sx={{ fontSize: 13, color: "#64748b", mb: 1 }}>{alert.description}</Typography>
                <Stack direction="row" spacing={2}>
                  <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>{alert.source}</Typography>
                  <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>{timeAgo(alert.createdAt)}</Typography>
                  <Chip label={alert.category} size="small" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
                </Stack>
              </Box>
              {!alert.isResolved && (
                <Button size="small" variant="outlined" onClick={() => onResolve(alert.id)} sx={{ ml: 2, fontSize: 12, minWidth: 0, px: 1.5 }}>Resolve</Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
