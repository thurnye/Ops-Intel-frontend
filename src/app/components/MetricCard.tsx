import type { ReactNode } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { FieldHelp } from "@app/components/FieldHelp";

type Props = {
  label: string;
  value: string | number;
  tone?: string;
  helpText?: string;
  icon?: ReactNode;
};

export function MetricCard({ label, value, tone = "#0f172a", helpText, icon }: Props) {
  return (
    <Card sx={{ height: "100%", background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.25 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
              {label}
            </Typography>
            {helpText ? <FieldHelp title={label} description={helpText} /> : null}
          </Stack>
          {icon ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2.5,
                bgcolor: `${tone}14`,
                color: tone,
                flexShrink: 0
              }}
            >
              {icon}
            </Stack>
          ) : null}
        </Stack>
        <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: tone, lineHeight: 1.1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
