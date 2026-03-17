import { Box } from "@mui/material";
import { PieChart, type PieValueType } from "@mui/x-charts";

type AppPieChartProps = {
  height?: number;
  data: PieValueType[];
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  cornerRadius?: number;
  arcLabel?: (item: PieValueType) => string;
};

export function AppPieChart({
  height = 300,
  data,
  innerRadius,
  outerRadius = 105,
  paddingAngle = 2,
  cornerRadius = 5,
  arcLabel,
}: AppPieChartProps) {
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <PieChart
        height={height}
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
  );
}
