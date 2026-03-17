import { AppLineChart } from "@app/components/charts";

type Props = {
  title: string;
  labels: string[];
  series: Array<{ label: string; data: number[] }>;
  height?: number;
};

export function TrendChart({ labels, series, height = 280 }: Props) {
  return <AppLineChart labels={labels} series={series} height={height} />;
}
