import { Box, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";

const sections = [
  { label: "My Profile", description: "Account information and contact details", to: "/settings/profile", icon: <PersonOutlineIcon /> },
  { label: "Preferences", description: "Notification and display settings", to: "/settings/preferences", icon: <TuneOutlinedIcon /> },
  { label: "Thresholds", description: "Operational alert threshold configuration", to: "/settings/thresholds", icon: <SpeedOutlinedIcon /> }
];

export function SettingsHomePage() {
  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Box>
        <Typography variant="h4">Settings</Typography>
        <Typography sx={{ fontSize: 14, color: "#64748b", mt: 0.5 }}>Platform configuration and preferences</Typography>
      </Box>
      <Stack spacing={1.5}>
        {sections.map((s) => (
          <Card key={s.label} component={RouterLink} to={s.to} sx={{ textDecoration: "none", "&:hover": { borderColor: "#6366f1" }, transition: "border-color 0.15s" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box className="flex h-10 w-10 items-center justify-center rounded-xl" sx={{ bgcolor: "#eef2ff", color: "#6366f1" }}>{s.icon}</Box>
                <Box className="flex-1">
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: 13, color: "#64748b" }}>{s.description}</Typography>
                </Box>
                <ArrowForwardIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
