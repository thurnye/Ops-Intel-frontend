export type BulkCreateItemPayload<TPayload> = {
  sourceRowNumber: number;
  clientRowId?: string;
  payload: TPayload;
};

export type BulkCreatePayload<TPayload> = {
  items: BulkCreateItemPayload<TPayload>[];
};

export type BulkCreateResult<TResponse> = {
  sourceRowNumber: number;
  clientRowId?: string;
  success: boolean;
  errorMessage?: string;
  data?: TResponse;
};

export type BulkCreateResponse<TResponse> = {
  totalRequested: number;
  successCount: number;
  failureCount: number;
  results: BulkCreateResult<TResponse>[];
};
