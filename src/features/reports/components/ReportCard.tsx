import { Card, CardContent, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { ReportData } from "@features/reports/types/reports.types";
import { changeColor } from "@features/reports/utils/reports.utils";

type Props = { report: ReportData };

export function ReportCard({ report }: Props) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{report.title}</Typography>
          <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Generated {new Date(report.generatedAt).toLocaleDateString()}</Typography>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Metric</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="right">Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ color: "#334155", fontWeight: 500 }}>{row.label}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "#0f172a" }}>{row.value}</TableCell>
                  <TableCell align="right">
                    <Chip label={row.change} color={changeColor(row)} size="small" variant="outlined" sx={{ height: 22, fontSize: 11 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
