import { Box } from "@mui/material";
import { BarChart, type BarSeriesType } from "@mui/x-charts";

type AppBarChartProps = {
  height?: number;
  labels: string[];
  series: Array<Omit<BarSeriesType, "type">>;
  layout?: "horizontal" | "vertical";
  showHorizontalGrid?: boolean;
  showVerticalGrid?: boolean;
};

export function AppBarChart({
  height = 300,
  labels,
  series,
  layout = "vertical",
  showHorizontalGrid = true,
  showVerticalGrid = false,
}: AppBarChartProps) {
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <BarChart
        height={height}
        layout={layout}
        xAxis={layout === "vertical" ? [{ scaleType: "band", data: labels }] : undefined}
        yAxis={layout === "horizontal" ? [{ scaleType: "band", data: labels }] : undefined}
        series={series}
        grid={{ horizontal: showHorizontalGrid, vertical: showVerticalGrid }}
      />
    </Box>
  );
}
