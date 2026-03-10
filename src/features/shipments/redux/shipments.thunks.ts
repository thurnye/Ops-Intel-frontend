import { createAsyncThunk } from "@reduxjs/toolkit";
import { shipmentsApi } from "@features/shipments/services/shipments.api.service";
import type { Shipment, ShipmentFilters, ShipmentListItem } from "@features/shipments/types/shipments.types";
import type { PaginationMeta } from "@shared/types/api.types";
import { getApiData, getErrorMessage, getPagedItems, getPaginationMeta } from "@shared/utils/asyncThunk.utils";

type ShipmentsListPayload = {
  shipments: ShipmentListItem[];
  pagination: PaginationMeta | null;
};

export const fetchShipments = createAsyncThunk<ShipmentsListPayload, { page: number; pageSize: number; filters: ShipmentFilters }, { rejectValue: string }>(
  "shipments/fetchShipments",
  async ({ page, pageSize, filters }, { rejectWithValue }) => {
    try {
      const response = await shipmentsApi.listShipments({
        pageNumber: page,
        pageSize,
        search: filters.query || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        type: filters.type === "all" ? undefined : filters.type,
        priority: filters.priority === "all" ? undefined : filters.priority,
        isCrossBorder: filters.isCrossBorder === "all" ? undefined : filters.isCrossBorder,
        isPartialShipment: filters.isPartialShipment === "all" ? undefined : filters.isPartialShipment
      });
      return {
        shipments: getPagedItems(response),
        pagination: getPaginationMeta(response)
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load shipments."));
    }
  }
);

export const fetchShipmentById = createAsyncThunk<Shipment, string, { rejectValue: string }>(
  "shipments/fetchShipmentById",
  async (shipmentId, { rejectWithValue }) => {
    try {
      return getApiData(await shipmentsApi.getShipment(shipmentId), null as never);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load shipment details."));
    }
  }
);
