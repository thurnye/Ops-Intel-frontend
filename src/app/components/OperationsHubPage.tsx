import type { ReactNode } from "react";
import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { FieldHelp } from "@app/components/FieldHelp";
import { Link as RouterLink } from "react-router-dom";

type HubStat = {
  label: string;
  value: string | number;
  tone?: string;
  description?: string;
  icon?: ReactNode;
};

type HubAction = {
  title: string;
  description: string;
  to: string;
  cta: string;
};

type Props = {
  title: string;
  description: string;
  eyebrow?: string;
  stats: HubStat[];
  actions: HubAction[];
  highlights?: string[];
};

export function OperationsHubPage({ title, description, eyebrow, stats, actions, highlights = [] }: Props) {
  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Card
        sx={{
          overflow: "hidden",
          background: "radial-gradient(circle at top left, rgba(99,102,241,0.24), transparent 28%), radial-gradient(circle at bottom right, rgba(56,189,248,0.16), transparent 24%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff"
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2.25}>
                {eyebrow ? (
                  <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(226,232,240,0.8)" }}>
                    {eyebrow}
                  </Typography>
                ) : null}
                <Box>
                  <Typography variant="h4" sx={{ color: "#fff" }}>{title}</Typography>
                  <Typography sx={{ mt: 1, maxWidth: 760, color: "rgba(226,232,240,0.86)", fontSize: 14, lineHeight: 1.7 }}>
                    {description}
                  </Typography>
                </Box>
                {highlights.length ? (
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {highlights.map((highlight) => (
                      <Chip
                        key={highlight}
                        label={highlight}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.08)",
                          color: "#e2e8f0",
                          border: "1px solid rgba(255,255,255,0.1)"
                        }}
                      />
                    ))}
                  </Stack>
                ) : null}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  border: "1px solid rgba(255,255,255,0.1)",
                  bgcolor: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)"
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(226,232,240,0.74)", mb: 1.5 }}>
                    Situation Snapshot
                  </Typography>
                  <Stack spacing={1.25}>
                    {stats.slice(0, 3).map((stat) => (
                      <Stack key={stat.label} direction="row" justifyContent="space-between" alignItems="baseline">
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          {stat.icon ? <Box sx={{ color: stat.tone ?? "#fff", display: "flex", alignItems: "center" }}>{stat.icon}</Box> : null}
                          <Typography sx={{ fontSize: 12.5, color: "rgba(226,232,240,0.78)" }}>{stat.label}</Typography>
                        </Stack>
                        <Typography sx={{ fontSize: 18, fontWeight: 800, color: stat.tone ?? "#fff" }}>{stat.value}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <Card sx={{ height: "100%", background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{stat.label}</Typography>
                    {stat.description ? <FieldHelp title={stat.label} description={stat.description} /> : null}
                  </Stack>
                  {stat.icon ? (
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 2.5,
                        bgcolor: `${stat.tone ?? "#0f172a"}14`,
                        color: stat.tone ?? "#0f172a",
                        flexShrink: 0
                      }}
                    >
                      {stat.icon}
                    </Stack>
                  ) : null}
                </Stack>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: stat.tone ?? "#0f172a", lineHeight: 1.1 }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {actions.map((action) => (
          <Grid key={action.title} size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%", background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
              <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5, height: "100%" }}>
                <Box>
                  <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0f172a", mb: 1 }}>{action.title}</Typography>
                  <Typography sx={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6 }}>{action.description}</Typography>
                </Box>
                <Box sx={{ mt: "auto" }}>
                  <Button component={RouterLink} to={action.to} variant="outlined">{action.cta}</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
