import { Box, Stack, Typography } from "@mui/material";
import { PieChart, type PieValueType } from "@mui/x-charts";

type AppPieChartProps = {
  height?: number;
  data: PieValueType[];
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  cornerRadius?: number;
  arcLabel?: (item: PieValueType) => string;
  showLegend?: boolean;
};

const pieLegendColors = [
  "#3b82f6",
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

export function AppPieChart({
  height = 300,
  data,
  innerRadius,
  outerRadius = 105,
  paddingAngle = 2,
  cornerRadius = 5,
  arcLabel,
  showLegend = false,
}: AppPieChartProps) {
  return (
    <Stack spacing={2} sx={{ width: "100%", overflow: "hidden" }}>
      <Box>
        <PieChart
          height={height}
          hideLegend={showLegend}
          series={[
            {
              data,
              innerRadius,
              outerRadius,
              paddingAngle,
              cornerRadius,
              arcLabel,
            },
          ]}
        />
      </Box>

      {showLegend ? (
        <Stack
          direction="row"
          flexWrap="wrap"
          useFlexGap
          gap={1.25}
          justifyContent="center"
          sx={{ px: 1 }}
        >
          {data.map((item, index) => (
            <Stack
              key={`${item.label ?? "slice"}-${index}`}
              direction="row"
              spacing={0.75}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "999px",
                  bgcolor: pieLegendColors[index % pieLegendColors.length],
                }}
              />
              <Typography sx={{ fontSize: 12.5, color: "#475569" }}>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
