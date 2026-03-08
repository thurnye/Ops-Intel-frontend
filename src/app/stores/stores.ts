import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@features/auth/redux/slices/auth.slice";
import dashboardReducer from "@features/dashboard/redux/slices/dashboard.slice";
import ordersReducer from "@features/orders/redux/slices/orders.slice";
import inventoryReducer from "@features/inventory/redux/slices/inventory.slice";
import productionReducer from "@features/production/redux/slices/production.slice";
import schedulingReducer from "@features/scheduling/redux/slices/scheduling.slice";
import shipmentsReducer from "@features/shipments/redux/slices/shipments.slice";
import reportsReducer from "@features/reports/redux/slices/reports.slice";
import analyticsReducer from "@features/analytics/redux/slices/analytics.slice";
import alertsReducer from "@features/alerts/redux/slices/alerts.slice";
import usersReducer from "@features/users/redux/slices/users.slice";
import settingsReducer from "@features/settings/redux/slices/settings.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    orders: ordersReducer,
    inventory: inventoryReducer,
    production: productionReducer,
    scheduling: schedulingReducer,
    shipments: shipmentsReducer,
    reports: reportsReducer,
    analytics: analyticsReducer,
    alerts: alertsReducer,
    users: usersReducer,
    settings: settingsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
