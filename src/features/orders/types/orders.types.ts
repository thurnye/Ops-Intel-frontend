export type OrderStatus = "new" | "in_production" | "delayed" | "ready_to_ship" | "shipped";

export type SalesOrder = {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  dueDate: string;
  status: OrderStatus;
};

export type OrdersFilters = {
  query: string;
  status: "all" | OrderStatus;
};
