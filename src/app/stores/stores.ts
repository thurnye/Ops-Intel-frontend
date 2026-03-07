import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@features/auth/redux/slices/auth.slice";
import dashboardReducer from "@features/dashboard/redux/slices/dashboard.slice";
import inventoryReducer from "@features/inventory/redux/slices/inventory.slice";
import ordersReducer from "@features/orders/redux/slices/orders.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    orders: ordersReducer,
    inventory: inventoryReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
