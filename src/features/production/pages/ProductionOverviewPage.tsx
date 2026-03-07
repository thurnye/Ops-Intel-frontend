import {
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ProductionBoard } from "@features/production/components/ProductionBoard";
import { useProduction } from "@features/production/hooks/useProduction";

export function ProductionOverviewPage() {
  const workOrders = useProduction();
  const completionRate = 78;
  const kpis = [
    { label: "Revenue (MTD)", value: "$4.8M", tone: "success" as const },
    { label: "Gross Margin", value: "31.4%", tone: "primary" as const },
    { label: "Cash Conversion", value: "42 days", tone: "warning" as const },
    { label: "Operating Cost", value: "$2.1M", tone: "info" as const }
  ];

  return (
    <Container className="space-y-6">
      <Stack spacing={1}>
        <Typography className="text-slate-900" variant="h4">
          Financial Dashboard
        </Typography>
        <Typography color="text.secondary" variant="body1">
          Snapshot of financial performance across production, inventory, and order execution.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {kpis.map((kpi) => (
          <Grid key={kpi.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card className="border border-slate-200 shadow-sm">
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary" variant="body2">
                    {kpi.label}
                  </Typography>
                  <Chip color={kpi.tone} label={kpi.value} size="small" variant="outlined" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ProductionBoard completionRate={completionRate} totalOrders={workOrders.length} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card className="h-full border border-slate-200 shadow-md">
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="overline">Quick Navigation</Typography>
                <RouterLink className="text-brand hover:underline" to="/inventory">
                  Inventory valuation
                </RouterLink>
                <RouterLink className="text-brand hover:underline" to="/production">
                  Cost vs throughput
                </RouterLink>
                <Typography color="text.secondary" variant="body2">
                  Finance reporting widgets can be added to this dashboard shell.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
