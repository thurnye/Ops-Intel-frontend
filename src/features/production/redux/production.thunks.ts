import { createAsyncThunk } from "@reduxjs/toolkit";
import { productionApi } from "@features/production/services/production.api.service";
import type { ProductionOrder, ProductionOrderSummary } from "@features/production/types/production.types";
import type { PaginationMeta } from "@shared/types/api.types";
import { getApiData, getErrorMessage, getPagedItems, getPaginationMeta } from "@shared/utils/asyncThunk.utils";

type ProductionOrdersPayload = {
  orders: ProductionOrderSummary[];
  pagination: PaginationMeta | null;
};

export const fetchProductionOrders = createAsyncThunk<ProductionOrdersPayload, { page: number; pageSize: number }, { rejectValue: string }>(
  "production/fetchOrders",
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await productionApi.listOrders({ pageNumber: page, pageSize });
      return {
        orders: getPagedItems(response),
        pagination: getPaginationMeta(response)
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load production orders."));
    }
  }
);

export const fetchProductionOrderById = createAsyncThunk<ProductionOrder, string, { rejectValue: string }>(
  "production/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      return getApiData(await productionApi.getOrder(orderId), null as never);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load production order details."));
    }
  }
);
