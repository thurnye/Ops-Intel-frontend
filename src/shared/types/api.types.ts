/* ── API envelope ──────────────────────────────────── */

export type ApiResponse<T> = {
  data: T | null;
  meta: ApiMeta;
  errors?: ApiError[];
};

export type ApiMeta = {
  requestId: string;
  timestamp: string;
  pagination?: PaginationMeta;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiError = {
  code: string;
  message: string;
  field?: string;
};

/* ── Paged response (used by inventory & others) ── */

export type PagedResponse<T> = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  items: T[];
};

export type PaginatedResponse<T> = PagedResponse<T>;
