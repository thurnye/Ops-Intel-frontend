import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, IconButton, Popover, Stack, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  title: string;
  description: string;
};

export function FieldHelp({ title, description }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        aria-label={`Explain ${title}`}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        size="small"
        sx={{
          p: 0.25,
          color: "#94a3b8",
          "&:hover": {
            color: "#475569",
            bgcolor: "transparent"
          }
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 14 }} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              maxWidth: 320,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)"
            }
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack spacing={0.75}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: 12.5, lineHeight: 1.55, color: "#475569" }}>
              {description}
            </Typography>
          </Stack>
        </Box>
      </Popover>
    </>
  );
}
