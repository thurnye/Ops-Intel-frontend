import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type HubStat = {
  label: string;
  value: string | number;
  tone?: string;
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
};

export function OperationsHubPage({ title, description, eyebrow, stats, actions }: Props) {
  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Card
        sx={{
          overflow: "hidden",
          background: "radial-gradient(circle at top left, rgba(99,102,241,0.2), transparent 30%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff"
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={2}>
            {eyebrow ? (
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(226,232,240,0.8)" }}>
                {eyebrow}
              </Typography>
            ) : null}
            <Box>
              <Typography variant="h4" sx={{ color: "#fff" }}>{title}</Typography>
              <Typography sx={{ mt: 1, maxWidth: 760, color: "rgba(226,232,240,0.86)", fontSize: 14 }}>
                {description}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#64748b", mb: 0.5 }}>{stat.label}</Typography>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: stat.tone ?? "#0f172a", lineHeight: 1.1 }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {actions.map((action) => (
          <Grid key={action.title} size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%" }}>
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
