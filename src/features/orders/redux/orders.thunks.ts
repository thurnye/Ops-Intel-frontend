import { createAsyncThunk } from "@reduxjs/toolkit";
import { ordersApi } from "@features/orders/services/orders.api.service";
import type { OrderDetail, OrderListItem } from "@features/orders/types/orders.types";
import type { PaginationMeta } from "@shared/types/api.types";
import { getApiData, getErrorMessage, getPagedItems, getPaginationMeta } from "@shared/utils/asyncThunk.utils";

type OrdersListPayload = {
  orders: OrderListItem[];
  pagination: PaginationMeta | null;
};

export const fetchOrders = createAsyncThunk<OrdersListPayload, { page: number; pageSize: number }, { rejectValue: string }>(
  "orders/fetchOrders",
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await ordersApi.listOrders({ pageNumber: page, pageSize });
      return {
        orders: getPagedItems(response),
        pagination: getPaginationMeta(response)
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load orders."));
    }
  }
);

export const fetchOrderById = createAsyncThunk<OrderDetail, string, { rejectValue: string }>(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      return getApiData(await ordersApi.getOrder(orderId), null as never);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load order details."));
    }
  }
);
