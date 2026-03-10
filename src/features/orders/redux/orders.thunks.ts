import { createAsyncThunk } from "@reduxjs/toolkit";
import { ordersApi } from "@features/orders/services/orders.api.service";
import type { OrderDetail, OrderListItem, OrdersFilters } from "@features/orders/types/orders.types";
import type { PaginationMeta } from "@shared/types/api.types";
import { getApiData, getErrorMessage, getPagedItems, getPaginationMeta } from "@shared/utils/asyncThunk.utils";

type OrdersListPayload = {
  orders: OrderListItem[];
  pagination: PaginationMeta | null;
};

export const fetchOrders = createAsyncThunk<OrdersListPayload, { page: number; pageSize: number; filters: OrdersFilters }, { rejectValue: string }>(
  "orders/fetchOrders",
  async ({ page, pageSize, filters }, { rejectWithValue }) => {
    try {
      const response = await ordersApi.listOrders({
        pageNumber: page,
        pageSize,
        searchTerm: filters.query || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        orderType: filters.orderType === "all" ? undefined : filters.orderType
      });
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
