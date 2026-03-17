import { Box, Button, Stack, Typography } from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

type DashboardDataTableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
};

export function DashboardDataTable<T extends object>({ data, columns }: DashboardDataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Box>
      <Box sx={{ overflowX: "auto" }}>
        <Box component="table" sx={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <Box component="thead">
            {table.getHeaderGroups().map((headerGroup) => (
              <Box component="tr" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Box
                    component="th"
                    key={header.id}
                    sx={{
                      textAlign: "left",
                      py: 1.5,
                      px: 1.5,
                      fontSize: 13,
                      color: "text.secondary",
                      fontWeight: 700,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>

          <Box component="tbody">
            {table.getRowModel().rows.map((row) => (
              <Box component="tr" key={row.id} sx={{ "&:hover": { bgcolor: "action.hover" } }}>
                {row.getVisibleCells().map((cell) => (
                  <Box
                    component="td"
                    key={cell.id}
                    sx={{
                      py: 1.5,
                      px: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      fontSize: 14,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Showing {table.getRowModel().rows.length} of {data.length} records
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
