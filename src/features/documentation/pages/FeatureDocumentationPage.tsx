import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
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
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useDeferredValue, useMemo, useState } from "react";
import { Link as RouterLink, NavLink, useParams } from "react-router-dom";
import { documentationFeatureMap, documentationFeatures } from "@features/documentation/content/documentation.data";

const featureIconMap = {
  orders: <ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />,
  inventory: <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />,
  production: <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 18 }} />,
  scheduling: <EventRepeatOutlinedIcon sx={{ fontSize: 18 }} />,
  shipments: <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />
} as const;

export function FeatureDocumentationPage() {
  const { feature = "" } = useParams();
  const doc = documentationFeatureMap[feature];
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredSections = useMemo(
    () => (doc?.sections ?? []).filter((section) => {
      if (!deferredQuery) return true;

      const haystack = [
        section.title,
        section.summary,
        ...(section.paragraphs ?? []),
        ...(section.bullets ?? []),
        section.callout ?? ""
      ].join(" ").toLowerCase();

      return haystack.includes(deferredQuery);
    }),
    [deferredQuery, doc]
  );

  const filteredTerms = useMemo(
    () => (doc?.terms ?? []).filter((term) => {
      if (!deferredQuery) return true;

      return `${term.term} ${term.definition} ${term.whyItMatters}`.toLowerCase().includes(deferredQuery);
    }),
    [deferredQuery, doc]
  );

  if (!doc) {
    return (
      <Container maxWidth={false} disableGutters>
        <Card sx={{ borderRadius: "22px", border: "1px solid #e2e8f0" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Guide not found</Typography>
            <Typography sx={{ mt: 1, fontSize: 14, color: "#64748b" }}>
              The requested feature documentation does not exist.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Stack direction={{ xs: "column", xl: "row" }} spacing={3} alignItems="flex-start">
        <Box
          sx={{
            width: { xs: "100%", xl: 280 },
            position: { xl: "sticky" },
            top: { xl: 76 }
          }}
        >
          <Card sx={{ borderRadius: "22px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={2.5}>
                <Stack spacing={1.25}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8" }}>
                    Documentation
                  </Typography>
                  <RouterLink to="/documentation" style={{ textDecoration: "none" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ArrowBackOutlinedIcon sx={{ fontSize: 16, color: "#64748b" }} />
                      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "#334155" }}>Back to guides</Typography>
                    </Stack>
                  </RouterLink>
                </Stack>

                <Divider />

                <Stack spacing={0.75}>
                  {documentationFeatures.map((featureItem) => (
                    <Box
                      key={featureItem.slug}
                      component={NavLink}
                      to={`/documentation/${featureItem.slug}`}
                      sx={{
                        textDecoration: "none",
                        borderRadius: "14px",
                        px: 1.5,
                        py: 1.25,
                        color: "#475569",
                        display: "block",
                        "&.active": {
                          bgcolor: alpha(featureItem.tone, 0.08),
                          color: featureItem.tone
                        },
                        "&:hover": {
                          bgcolor: "#f8fafc"
                        }
                      }}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Box sx={{ color: "inherit", display: "grid", placeItems: "center" }}>{featureIconMap[featureItem.iconKey]}</Box>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>{featureItem.title}</Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>

                <Divider />

                <Stack spacing={1}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8" }}>
                    On This Page
                  </Typography>
                  {doc.sections.map((section) => (
                    <Box
                      key={section.id}
                      component="a"
                      href={`#${section.id}`}
                      sx={{
                        textDecoration: "none",
                        color: "#475569",
                        fontSize: 13.5,
                        py: 0.4,
                        "&:hover": { color: doc.tone }
                      }}
                    >
                      {section.title}
                    </Box>
                  ))}
                  <Box component="a" href="#glossary" sx={{ textDecoration: "none", color: "#475569", fontSize: 13.5, py: 0.4, "&:hover": { color: doc.tone } }}>
                    Glossary
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Stack spacing={3} sx={{ minWidth: 0, flex: 1 }}>
          <Card
            sx={{
              overflow: "hidden",
              borderRadius: "24px",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              background: `linear-gradient(135deg, ${alpha(doc.tone, 0.16)} 0%, #ffffff 40%, ${alpha(doc.tone, 0.06)} 100%)`
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip icon={<MenuBookOutlinedIcon />} label={`${doc.title} guide`} sx={{ bgcolor: alpha(doc.tone, 0.1), color: doc.tone, fontWeight: 700 }} />
                  <Chip label={doc.audience} sx={{ bgcolor: "#f8fafc", color: "#334155" }} />
                </Stack>
                <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems={{ lg: "center" }}>
                  <Stack spacing={1.5} sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ width: 46, height: 46, borderRadius: "16px", display: "grid", placeItems: "center", bgcolor: alpha(doc.tone, 0.12), color: doc.tone }}>
                        {featureIconMap[doc.iconKey]}
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#0f172a" }}>{doc.title}</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#334155" }}>{doc.tagline}</Typography>
                    <Typography sx={{ fontSize: 14.5, color: "#475569", maxWidth: 900 }}>{doc.summary}</Typography>
                  </Stack>
                  <Card sx={{ minWidth: { lg: 300 }, borderRadius: "18px", border: "1px solid #e2e8f0", boxShadow: "none" }}>
                    <CardContent sx={{ p: 2.2 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", mb: 1 }}>
                        Source
                      </Typography>
                      <Typography sx={{ fontSize: 13.5, color: "#334155", fontWeight: 600 }}>{doc.backendDoc}</Typography>
                    </CardContent>
                  </Card>
                </Stack>
                <TextField
                  fullWidth
                  placeholder={`Search inside ${doc.title} documentation...`}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  sx={{
                    maxWidth: 760,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      bgcolor: "white"
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

          <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
            <Card sx={{ flex: 1, borderRadius: "20px", border: "1px solid #e2e8f0" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <HubOutlinedIcon sx={{ color: doc.tone }} />
                    <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Typical Flow</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {doc.flow.map((step, index) => (
                      <Chip key={step} label={`${index + 1}. ${step}`} sx={{ bgcolor: alpha(doc.tone, 0.08), color: doc.tone, fontWeight: 700 }} />
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: "20px", border: "1px solid #e2e8f0" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <InfoOutlinedIcon sx={{ color: doc.tone }} />
                    <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Quick Facts</Typography>
                  </Stack>
                  {doc.quickFacts.map((fact) => (
                    <Stack key={fact} direction="row" spacing={1.25} alignItems="flex-start">
                      <TaskAltOutlinedIcon sx={{ fontSize: 17, color: doc.tone, mt: "2px" }} />
                      <Typography sx={{ fontSize: 13.5, color: "#475569" }}>{fact}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <Stack spacing={2.5}>
            {filteredSections.map((section) => (
              <Card
                id={section.id}
                key={section.id}
                sx={{ borderRadius: "22px", border: "1px solid #e2e8f0", scrollMarginTop: "88px" }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack spacing={2}>
                    <Stack spacing={0.75}>
                      <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: doc.tone }}>
                        Section
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>{section.title}</Typography>
                      <Typography sx={{ fontSize: 15, color: "#475569" }}>{section.summary}</Typography>
                    </Stack>

                    {section.paragraphs?.map((paragraph) => (
                      <Typography key={paragraph} sx={{ fontSize: 14, lineHeight: 1.75, color: "#334155" }}>
                        {paragraph}
                      </Typography>
                    ))}

                    {section.bullets?.length ? (
                      <Stack spacing={1.1}>
                        {section.bullets.map((bullet) => (
                          <Stack key={bullet} direction="row" spacing={1.25} alignItems="flex-start">
                            <Box sx={{ width: 8, height: 8, borderRadius: "999px", bgcolor: doc.tone, mt: "8px", flexShrink: 0 }} />
                            <Typography sx={{ fontSize: 14, lineHeight: 1.7, color: "#334155" }}>{bullet}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    ) : null}

                    {section.callout ? (
                      <Box sx={{ borderRadius: "18px", bgcolor: alpha(doc.tone, 0.06), border: `1px solid ${alpha(doc.tone, 0.16)}`, p: 2 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: doc.tone, mb: 0.6 }}>
                          Important
                        </Typography>
                        <Typography sx={{ fontSize: 13.5, color: "#334155" }}>{section.callout}</Typography>
                      </Box>
                    ) : null}
                  </Stack>
                </CardContent>
              </Card>
            ))}

            {filteredSections.length === 0 ? (
              <Card sx={{ borderRadius: "22px", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>No section matched your search.</Typography>
                  <Typography sx={{ mt: 0.75, fontSize: 14, color: "#64748b" }}>
                    Try searching for a simpler concept like `status`, `workflow`, `API`, `shipment`, or `routing`.
                  </Typography>
                </CardContent>
              </Card>
            ) : null}

            <Card id="glossary" sx={{ borderRadius: "22px", border: "1px solid #e2e8f0", scrollMarginTop: "88px" }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2.2}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <AccountTreeOutlinedIcon sx={{ color: doc.tone }} />
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>Glossary</Typography>
                  </Stack>
                  {filteredTerms.map((term) => (
                    <Box key={term.term} sx={{ borderRadius: "18px", border: "1px solid #e2e8f0", p: 2.2 }}>
                      <Typography sx={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>{term.term}</Typography>
                      <Typography sx={{ mt: 1, fontSize: 14, color: "#334155" }}>{term.definition}</Typography>
                      <Typography sx={{ mt: 1.1, fontSize: 13.5, color: "#64748b" }}>
                        <Box component="span" sx={{ fontWeight: 800, color: "#475569" }}>Why it matters: </Box>
                        {term.whyItMatters}
                      </Typography>
                    </Box>
                  ))}
                  {filteredTerms.length === 0 ? (
                    <Typography sx={{ fontSize: 14, color: "#94a3b8" }}>No glossary item matched your search.</Typography>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
