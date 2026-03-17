import { alpha, Avatar, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import type { DashboardModuleCard } from "@features/dashboard/types/dashboard.types";
import { renderDashboardIcon } from "@features/dashboard/utils/dashboard.icons";
import { getDashboardModuleStatusColor } from "@features/dashboard/utils/dashboard.utils";

type DashboardModuleHealthCardProps = {
  moduleCard: DashboardModuleCard;
};

export function DashboardModuleHealthCard({ moduleCard }: DashboardModuleHealthCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: alpha(moduleCard.color, 0.12),
                color: moduleCard.color,
                width: 48,
                height: 48,
                borderRadius: 3,
              }}
            >
              {renderDashboardIcon(moduleCard.iconKey)}
            </Avatar>
            <Chip
              label={moduleCard.status}
              color={getDashboardModuleStatusColor(moduleCard.status)}
              size="small"
            />
          </Stack>

          <Stack>
            <Typography variant="subtitle1" fontWeight={700}>
              {moduleCard.title}
            </Typography>
            <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5 }}>
              {moduleCard.value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {moduleCard.note}
            </Typography>
          </Stack>

          <Button size="small" endIcon={<ArrowOutwardRoundedIcon />} sx={{ alignSelf: "flex-start", px: 0 }}>
            View details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
