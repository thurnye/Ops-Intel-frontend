import { useMemo, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState
} from "@tanstack/react-table";
import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

export type AppDataTableColumnDef<TData> = ColumnDef<TData> & {
  meta?: {
    align?: "left" | "center" | "right";
    width?: string | number;
  };
};

type AppDataTableColumnMeta = {
  align?: "left" | "center" | "right";
  width?: string | number;
};

type ResponsiveDimension = string | number | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", string | number>>;

type AppDataTableProps<TData> = {
  columns: AppDataTableColumnDef<TData>[];
  data: TData[];
  emptyState: string;
  onRowClick?: (row: TData) => void;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  maxBodyHeight?: number;
  leadingToolbarSlot?: ReactNode;
  manualPagination?: boolean;
  pageIndex?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  tableMinWidth?: ResponsiveDimension;
  tableMaxWidth?: ResponsiveDimension;
  useParentHorizontalOverflow?: boolean;
};

export function AppDataTable<TData>({
  columns,
  data,
  emptyState,
  onRowClick,
  pageSizeOptions = [10, 25, 50],
  initialPageSize = 10,
  maxBodyHeight,
  leadingToolbarSlot,
  manualPagination = false,
  pageIndex,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  tableMinWidth,
  tableMaxWidth,
  useParentHorizontalOverflow = false
}: AppDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize
  });

  const resolvedPagination = {
    pageIndex: pageIndex ?? pagination.pageIndex,
    pageSize: pageSize ?? pagination.pageSize
  };

  const table = useReactTable({
    columns,
    data,
    state: { sorting, pagination: resolvedPagination },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const nextPagination = typeof updater === "function" ? updater(resolvedPagination) : updater;
      if (manualPagination) {
        onPageChange?.(nextPagination.pageIndex);
        if (nextPagination.pageSize !== resolvedPagination.pageSize) {
          onPageSizeChange?.(nextPagination.pageSize);
        }
        return;
      }
      setPagination(nextPagination);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    manualPagination,
    pageCount: manualPagination && totalRows != null ? Math.max(1, Math.ceil(totalRows / resolvedPagination.pageSize)) : undefined
  });

  const pageRows = table.getRowModel().rows;
  const resolvedTotalRows = totalRows ?? table.getPrePaginationRowModel().rows.length;
  const pageCount = table.getPageCount();

  const pageLabel = useMemo(() => {
    if (resolvedTotalRows === 0) {
      return "0 results";
    }

    const start = resolvedPagination.pageIndex * resolvedPagination.pageSize + 1;
    const end = Math.min(start + resolvedPagination.pageSize - 1, resolvedTotalRows);
    return `${start}-${end} of ${resolvedTotalRows}`;
  }, [resolvedPagination.pageIndex, resolvedPagination.pageSize, resolvedTotalRows]);

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        maxWidth: tableMaxWidth ?? "100%",
        borderRadius: 1,
        border: "1px solid #e2e8f0",
        background:
          "linear-gradient(180deg, rgba(248,250,252,0.92) 0%, rgba(255,255,255,1) 18%)"
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{
          px: 2.25,
          py: 1.5,
          borderBottom: "1px solid #e2e8f0",
          background: "rgba(248, 250, 252, 0.84)"
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip
            label={`${resolvedTotalRows} rows`}
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: "#e0f2fe",
              color: "#075985"
            }}
          />
          {leadingToolbarSlot}
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography sx={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
            Rows
          </Typography>
          <Select
            size="small"
            value={String(resolvedPagination.pageSize)}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            sx={{
              minWidth: 88,
              bgcolor: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dbe4ee" }
            }}
          >
            {pageSizeOptions.map((pageSize) => (
              <MenuItem key={pageSize} value={pageSize}>
                {pageSize}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>

      <Box
        sx={{
          width: "100%",
          overflowX: useParentHorizontalOverflow ? "visible" : "auto",
          maxHeight: maxBodyHeight,
          maxWidth: "100%"
        }}
      >
        <Box
          component="table"
          sx={{
            width: tableMinWidth ? "max-content" : "100%",
            minWidth: tableMinWidth ?? 750,
            borderCollapse: "separate",
            borderSpacing: 0
          }}
        >
          <Box component="thead" sx={{ position: "sticky", top: 0, zIndex: 1 }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Box component="tr" key={headerGroup.id} sx={{ backgroundColor: "#f8fafc" }}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();
                  const columnMeta = header.column.columnDef.meta as AppDataTableColumnMeta | undefined;
                  const align = columnMeta?.align ?? "left";

                  return (
                    <Box
                      component="th"
                      key={header.id}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderBottom: "1px solid #e2e8f0",
                        textAlign: align,
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: columnMeta?.width
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent={
                            align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start"
                          }
                          alignItems="center"
                          sx={{
                            cursor: canSort ? "pointer" : "default",
                            userSelect: "none",
                            minWidth: 0,
                            maxWidth: "100%"
                          }}
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        >
                          <Box
                            component="span"
                            sx={{
                              minWidth: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </Box>
                          {canSort ? (
                            sortDirection === "asc" ? (
                              <ArrowUpwardRoundedIcon sx={{ fontSize: 14 }} />
                            ) : sortDirection === "desc" ? (
                              <ArrowDownwardRoundedIcon sx={{ fontSize: 14 }} />
                            ) : (
                              <UnfoldMoreRoundedIcon sx={{ fontSize: 14, color: "#cbd5e1" }} />
                            )
                          ) : null}
                        </Stack>
                      )}
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>

          <Box component="tbody">
            {pageRows.length === 0 ? (
              <Box component="tr">
                <Box
                  component="td"
                  colSpan={columns.length}
                  sx={{
                    py: 6,
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: 14
                  }}
                >
                  {emptyState}
                </Box>
              </Box>
            ) : (
              pageRows.map((row) => (
                <Box
                  component="tr"
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    transition: "background-color 0.18s ease, transform 0.18s ease",
                    "&:nth-of-type(odd)": { backgroundColor: "rgba(248,250,252,0.56)" },
                    "&:hover": {
                      backgroundColor: onRowClick ? "#eff6ff" : "#f8fafc"
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnMeta = cell.column.columnDef.meta as AppDataTableColumnMeta | undefined;
                    const align = columnMeta?.align ?? "left";

                    return (
                      <Box
                        component="td"
                        key={cell.id}
                        sx={{
                          px: 2,
                          py: 1.6,
                          borderBottom: "1px solid #eef2f7",
                          textAlign: align,
                          verticalAlign: "middle",
                          fontSize: 13,
                          color: "#0f172a"
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Box>
                    );
                  })}
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={1.5}
        sx={{ px: 2.25, py: 1.5, backgroundColor: "#fff", borderTop: "1px solid #e2e8f0" }}
      >
        <Typography sx={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
          {pageLabel}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            size="small"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            sx={{ border: "1px solid #dbe4ee", borderRadius: 2 }}
          >
            <NavigateBeforeRoundedIcon fontSize="small" />
          </IconButton>
          <Chip
            label={`Page ${pageCount === 0 ? 0 : resolvedPagination.pageIndex + 1}${pageCount > 0 ? ` / ${pageCount}` : ""}`}
            size="small"
            sx={{ fontWeight: 700, bgcolor: "#f8fafc", color: "#334155" }}
          />
          <IconButton
            size="small"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            sx={{ border: "1px solid #dbe4ee", borderRadius: 2 }}
          >
            <NavigateNextRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
