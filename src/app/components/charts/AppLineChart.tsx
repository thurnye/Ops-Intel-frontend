import { Box } from "@mui/material";
import { LineChart, type LineSeriesType } from "@mui/x-charts";

type AppLineChartProps = {
  height?: number;
  labels: string[];
  series: Array<Omit<LineSeriesType, "type">>;
  showHorizontalGrid?: boolean;
  showVerticalGrid?: boolean;
};

export function AppLineChart({
  height = 300,
  labels,
  series,
  showHorizontalGrid = true,
  showVerticalGrid = false,
}: AppLineChartProps) {
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <LineChart
        height={height}
        xAxis={[{ scaleType: "point", data: labels }]}
        series={series}
        grid={{ horizontal: showHorizontalGrid, vertical: showVerticalGrid }}
      />
    </Box>
  );
}
