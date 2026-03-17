import { Box, Typography } from "@mui/material";

type DashboardSectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function DashboardSectionTitle({ title, subtitle }: DashboardSectionTitleProps) {
  return (
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
  );
}
