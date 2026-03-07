import { Box, Card, CardContent, Chip, Container, Grid, List, ListItem, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { KpiCard } from "@features/dashboard/components/KpiCard";
import { useDashboard } from "@features/dashboard/hooks/useDashboard";

export function DashboardOverviewPage() {
  const { kpis, alerts, recentActivity } = useDashboard();

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
        <Box>
          <Typography variant="h4">Dashboard</Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>
            Operations and finance overview
          </Typography>
        </Box>
        <Stack className="rounded-xl border border-slate-200 bg-white p-1" direction="row" spacing={0.5}>
          <Chip
            label="All time"
            size="small"
            sx={{ bgcolor: "#0f172a", color: "#fff", "&:hover": { bgcolor: "#1e293b" } }}
          />
          <Chip label="This year" size="small" variant="outlined" />
          <Chip label="This month" size="small" variant="outlined" />
          <Chip label="This week" size="small" variant="outlined" />
        </Stack>
      </Stack>

      <Grid container spacing={2.5}>
        {kpis.map((kpi) => (
          <Grid key={kpi.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <KpiCard kpi={kpi} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="h-full">
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Active Alerts</Typography>
                <Chip label={`${alerts.length}`} size="small" color="error" sx={{ height: 22, fontSize: 11 }} />
              </Stack>
              <List disablePadding>
                {alerts.map((alert) => (
                  <ListItem
                    key={alert.id}
                    className="!rounded-lg !px-3 !py-2.5"
                    sx={{ "&:not(:last-child)": { mb: 0.5 }, "&:hover": { bgcolor: "#f8fafc" } }}
                  >
                    <Box className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                    <Typography variant="body2" sx={{ color: "#334155" }}>{alert.title}</Typography>
                  </ListItem>
                ))}
              </List>
              <RouterLink
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 no-underline transition-colors hover:text-indigo-800"
                to="/inventory"
              >
                View inventory alerts
                <ArrowForwardIcon sx={{ fontSize: 14 }} />
              </RouterLink>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="h-full">
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>Recent Activity</Typography>
              <List disablePadding>
                {recentActivity.map((item) => (
                  <ListItem
                    key={item.id}
                    className="!rounded-lg !px-3 !py-2.5"
                    sx={{ "&:not(:last-child)": { mb: 0.5 }, "&:hover": { bgcolor: "#f8fafc" } }}
                  >
                    <Stack>
                      <Typography variant="body2" sx={{ color: "#334155" }}>{item.message}</Typography>
                      <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.25 }}>
                        {item.happenedAt}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
              <RouterLink
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 no-underline transition-colors hover:text-indigo-800"
                to="/orders"
              >
                Open orders workspace
                <ArrowForwardIcon sx={{ fontSize: 14 }} />
              </RouterLink>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
