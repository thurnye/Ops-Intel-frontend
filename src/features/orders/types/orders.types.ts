/* ── Enums ─────────────────────────────────────────── */

export enum OrderType {
  Sales = 1,
  Purchase = 2,
  Transfer = 3,
  Return = 4
}

export enum OrderStatus {
  Draft = 1,
  PendingApproval = 2,
  Approved = 3,
  Processing = 4,
  PartiallyFulfilled = 5,
  Fulfilled = 6,
  Shipped = 7,
  Delivered = 8,
  Cancelled = 9,
  Rejected = 10,
  Returned = 11
}

export enum OrderPriority {
  Low = 1,
  Normal = 2,
  High = 3,
  Urgent = 4
}

export enum OrderChannel {
  Internal = 1,
  Web = 2,
  Mobile = 3,
  Phone = 4,
  Email = 5,
  Marketplace = 6
}

export enum PaymentStatus {
  Unpaid = 1,
  Pending = 2,
  PartiallyPaid = 3,
  Paid = 4,
  PartiallyRefunded = 5,
  Refunded = 6,
  Failed = 7,
  Cancelled = 8
}

export enum PaymentMethod {
  Cash = 1,
  Card = 2,
  BankTransfer = 3,
  MobileMoney = 4,
  Cheque = 5,
  Wallet = 6,
  Other = 7
}

export enum PaymentTransactionType {
  Payment = 1,
  Refund = 2,
  Adjustment = 3,
  Chargeback = 4
}

export enum AddressType {
  Billing = 1,
  Shipping = 2
}

/* ── Response types ───────────────────────────────── */

export type OrderListItem = {
  id: string;
  orderNumber: string;
  customerName?: string;
  orderType: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  orderDateUtc: string;
};

export type OrderResponse = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  currencyCode: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productNameSnapshot: string;
  productSkuSnapshot: string;
  quantityOrdered: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
};

export type OrderPayment = {
  id: string;
  orderId: string;
  paymentReference: string;
  paymentMethod: PaymentMethod;
  transactionType: PaymentTransactionType;
  status: PaymentStatus;
  amount: number;
  feeAmount: number;
  netAmount: number;
  refundedAmount: number;
  currencyCode: string;
  paymentDateUtc: string;
};

export type OrderAddress = {
  id: string;
  orderId: string;
  addressType: AddressType;
  contactName: string;
  companyName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
};

export type OrderNote = {
  id: string;
  orderId: string;
  note: string;
  isInternal: boolean;
  createdBy?: string;
  createdAtUtc: string;
};

export type OrderStatusHistory = {
  id: string;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  reason?: string;
  changedBy?: string;
  changedAtUtc: string;
  comments?: string;
};

export type OrderDetail = OrderResponse & {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  orderType: OrderType;
  priority: OrderPriority;
  channel: OrderChannel;
  warehouseId?: string;
  orderDateUtc: string;
  requiredDateUtc?: string;
  referenceNumber?: string;
  customerPurchaseOrderNumber?: string;
  notes?: string;
  items: OrderItem[];
  addresses: OrderAddress[];
  notesList: OrderNote[];
  statusHistory: OrderStatusHistory[];
  payments: OrderPayment[];
};

/* ── Filters ──────────────────────────────────────── */

export type OrdersFilters = {
  query: string;
  status: OrderStatus | "all";
  orderType: OrderType | "all";
  paymentStatus: PaymentStatus | "all";
};
