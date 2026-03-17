import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useDeferredValue, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { documentationFeatures } from "@features/documentation/content/documentation.data";

const featureIconMap = {
  orders: <ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />,
  inventory: <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />,
  production: <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 18 }} />,
  scheduling: <EventRepeatOutlinedIcon sx={{ fontSize: 18 }} />,
  shipments: <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />
} as const;

export function DocumentationHomePage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredFeatures = useMemo(
    () => documentationFeatures.filter((feature) => {
      if (!deferredQuery) return true;

      const haystack = [
        feature.title,
        feature.tagline,
        feature.audience,
        feature.summary,
        ...feature.quickFacts,
        ...feature.flow,
        ...feature.sections.flatMap((section) => [section.title, section.summary, ...(section.paragraphs ?? []), ...(section.bullets ?? [])]),
        ...feature.terms.flatMap((term) => [term.term, term.definition, term.whyItMatters])
      ].join(" ").toLowerCase();

      return haystack.includes(deferredQuery);
    }),
    [deferredQuery]
  );

  return (
    <Container maxWidth={false} disableGutters className="space-y-6">
      <Card
        sx={{
          overflow: "hidden",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          background: "linear-gradient(135deg, #101828 0%, #0f172a 45%, #134e4a 100%)",
          color: "white"
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip icon={<MenuBookOutlinedIcon />} label="Guide Library" sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white" }} />
              <Chip label={`${documentationFeatures.length} feature guides`} sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "white" }} />
            </Stack>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(167,243,208,0.94)" }}>
                Documentation
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontWeight: 800, maxWidth: 920 }}>
                Browse feature guides that explain what each module does, how it works, and what users need to know.
              </Typography>
              <Typography sx={{ mt: 1.5, maxWidth: 860, color: "rgba(226,232,240,0.92)", fontSize: 15 }}>
                These guides are based on the backend module documentation for Orders, Inventory, Production, Scheduling, and Shipments. Click a feature card to open its full guide and search inside that documentation.
              </Typography>
            </Box>
            <TextField
              fullWidth
              placeholder="Search for a feature, term, workflow, or concept..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              sx={{
                maxWidth: 760,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.96)",
                  borderRadius: "16px"
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        {filteredFeatures.map((feature) => (
          <Grid key={feature.slug} size={{ xs: 12, md: 6 }}>
            <Card
              component={RouterLink}
              to={`/documentation/${feature.slug}`}
              sx={{
                display: "block",
                textDecoration: "none",
                height: "100%",
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 20px 45px rgba(15, 23, 42, 0.05)",
                transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 28px 55px rgba(15, 23, 42, 0.08)",
                  borderColor: alpha(feature.tone, 0.32)
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "16px",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: alpha(feature.tone, 0.1),
                        color: feature.tone
                      }}
                    >
                      {featureIconMap[feature.iconKey]}
                    </Box>
                    <Chip label="Open guide" icon={<ArrowOutwardOutlinedIcon sx={{ fontSize: 16 }} />} sx={{ bgcolor: "#f8fafc", color: "#334155" }} />
                  </Stack>
                  <Box>
                    <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{feature.title}</Typography>
                    <Typography sx={{ mt: 0.75, fontSize: 14, color: "#475569" }}>{feature.tagline}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13.5, color: "#334155" }}>{feature.summary}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {feature.flow.map((step) => (
                      <Chip key={step} label={step} size="small" sx={{ bgcolor: alpha(feature.tone, 0.08), color: feature.tone, fontWeight: 600 }} />
                    ))}
                  </Stack>
                  <Box sx={{ borderTop: "1px solid #e2e8f0", pt: 2 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", mb: 0.75 }}>
                      Based on
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#64748b" }}>{feature.backendDoc}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredFeatures.length === 0 ? (
        <Box sx={{ borderRadius: "20px", border: "1px solid #e2e8f0", bgcolor: "white", p: 3 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>No guide matched your search.</Typography>
          <Typography sx={{ mt: 0.75, fontSize: 14, color: "#64748b" }}>
            Try a module name like `orders` or `inventory`, or a concept like `routing`, `dispatch`, or `stock movement`.
          </Typography>
        </Box>
      ) : null}
    </Container>
  );
}
