import { Box, CircularProgress, Typography } from "@mui/material";

type Props = {
  label?: string;
};

export function RouteLoading({ label = "Loading view..." }: Props) {
  return (
    <Box
      sx={{
        minHeight: 240,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        color: "#64748b"
      }}
    >
      <CircularProgress size={28} thickness={4} />
      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{label}</Typography>
    </Box>
  );
}
