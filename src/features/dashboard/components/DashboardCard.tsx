import type { ReactNode } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";

type DashboardCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  minHeight?: number;
};

export function DashboardCard({ title, action, children, minHeight }: DashboardCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        minHeight,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}
