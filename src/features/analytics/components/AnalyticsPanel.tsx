import type { ReactNode } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { alpha, Box, Card, CardContent, Divider, IconButton, Stack, Typography, useTheme } from "@mui/material";

type AnalyticsPanelProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AnalyticsPanel({ title, subtitle, children }: AnalyticsPanelProps) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 1,
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2.25, pt: 2.25, pb: 1.5 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          <IconButton size="small">
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Divider />
        <Box sx={{ p: 2.25 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}
