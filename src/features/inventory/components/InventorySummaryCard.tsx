import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

type Props = {
  totalItems: number;
};

export function InventorySummaryCard({ totalItems }: Props) {
  return (
    <Card className="relative overflow-hidden">
      <Box className="absolute inset-x-0 top-0 h-1" sx={{ background: "linear-gradient(135deg, #10b981, #34d399)" }} />
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            sx={{ bgcolor: "#ecfdf5", color: "#10b981", border: "1px solid #d1fae5" }}
          >
            <Inventory2OutlinedIcon />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Active SKUs
            </Typography>
            <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              {totalItems}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
