import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

type AnalyticsSectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function AnalyticsSectionHeader({
  title,
  subtitle,
  action,
}: AnalyticsSectionHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      alignItems={{ xs: "flex-start", lg: "center" }}
      justifyContent="space-between"
      spacing={1.5}
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography variant="h4" fontWeight={800}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      {action ? <Box sx={{ p: 0.5 }}>{action}</Box> : null}
    </Stack>
  );
}
