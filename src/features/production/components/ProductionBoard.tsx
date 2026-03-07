import { Card, CardContent, LinearProgress, Stack, Typography } from "@mui/material";

type Props = {
  totalOrders: number;
  completionRate: number;
};

export function ProductionBoard({ totalOrders, completionRate }: Props) {
  return (
    <Card className="shadow-md border border-slate-200">
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="overline">Operational Cost Driver</Typography>
          <Typography variant="h5">{totalOrders} Open Work Orders</Typography>
          <Typography color="text.secondary" variant="body2">
            Completion efficiency: {completionRate}%
          </Typography>
          <LinearProgress className="rounded-full" value={completionRate} variant="determinate" />
        </Stack>
      </CardContent>
    </Card>
  );
}
