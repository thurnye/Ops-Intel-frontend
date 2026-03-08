import {
  OrderType,
  OrderStatus,
  OrderPriority,
  OrderChannel,
  PaymentStatus,
  PaymentMethod,
  PaymentTransactionType,
  AddressType,
  type OrderListItem,
  type OrderDetail,
  type OrderItem,
  type OrderPayment,
  type OrderAddress,
  type OrderNote,
  type OrderStatusHistory
} from "@features/orders/types/orders.types";

/* ── Order list items ─────────────────────────────── */

export const orderListMock: OrderListItem[] = [
  {
    id: "ord-1",
    orderNumber: "SO-1024",
    customerName: "Northline EV Components",
    orderType: OrderType.Sales,
    status: OrderStatus.Processing,
    paymentStatus: PaymentStatus.PartiallyPaid,
    totalAmount: 8160.00,
    orderDateUtc: "2026-03-01T08:30:00Z"
  },
  {
    id: "ord-2",
    orderNumber: "SO-1025",
    customerName: "Urban Build Systems",
    orderType: OrderType.Sales,
    status: OrderStatus.PendingApproval,
    paymentStatus: PaymentStatus.Unpaid,
    totalAmount: 5280.00,
    orderDateUtc: "2026-03-02T11:00:00Z"
  },
  {
    id: "ord-3",
    orderNumber: "PO-2024-0041",
    customerName: "Alcoa Corp",
    orderType: OrderType.Purchase,
    status: OrderStatus.Delivered,
    paymentStatus: PaymentStatus.Paid,
    totalAmount: 2125.00,
    orderDateUtc: "2026-02-20T09:00:00Z"
  },
  {
    id: "ord-4",
    orderNumber: "SO-1026",
    customerName: "GreenTech Fabrication",
    orderType: OrderType.Sales,
    status: OrderStatus.Shipped,
    paymentStatus: PaymentStatus.Paid,
    totalAmount: 15750.00,
    orderDateUtc: "2026-02-28T14:15:00Z"
  },
  {
    id: "ord-5",
    orderNumber: "SO-1027",
    customerName: "Pacific Rail Solutions",
    orderType: OrderType.Sales,
    status: OrderStatus.Draft,
    paymentStatus: PaymentStatus.Unpaid,
    totalAmount: 3420.00,
    orderDateUtc: "2026-03-07T16:45:00Z"
  },
  {
    id: "ord-6",
    orderNumber: "RET-0012",
    customerName: "Northline EV Components",
    orderType: OrderType.Return,
    status: OrderStatus.Returned,
    paymentStatus: PaymentStatus.Refunded,
    totalAmount: 680.00,
    orderDateUtc: "2026-03-05T10:20:00Z"
  }
];

/* ── Full order details (for detail pages) ────────── */

const items1: OrderItem[] = [
  { id: "oi-1", orderId: "ord-1", productId: "prod-1", productNameSnapshot: "6061 Aluminum Extrusion Bar", productSkuSnapshot: "ALU-6061-BAR", quantityOrdered: 1200, unitPrice: 6.80, discountAmount: 0, taxAmount: 0, lineTotal: 8160.00 }
];

const items2: OrderItem[] = [
  { id: "oi-2", orderId: "ord-2", productId: "prod-2", productNameSnapshot: "7005 Aluminum Extrusion Tube", productSkuSnapshot: "ALU-7005-TUBE", quantityOrdered: 400, unitPrice: 13.20, discountAmount: 0, taxAmount: 0, lineTotal: 5280.00 }
];

const payments1: OrderPayment[] = [
  { id: "pay-1", orderId: "ord-1", paymentReference: "PAY-20260301-001", paymentMethod: PaymentMethod.BankTransfer, transactionType: PaymentTransactionType.Payment, status: PaymentStatus.Paid, amount: 4000.00, feeAmount: 15.00, netAmount: 3985.00, refundedAmount: 0, currencyCode: "USD", paymentDateUtc: "2026-03-01T12:00:00Z" }
];

const addresses1: OrderAddress[] = [
  { id: "addr-1", orderId: "ord-1", addressType: AddressType.Shipping, contactName: "Tom Lee", companyName: "Northline EV Components", addressLine1: "800 Battery Park Dr", city: "Detroit", stateOrProvince: "MI", postalCode: "48201", country: "US" },
  { id: "addr-2", orderId: "ord-1", addressType: AddressType.Billing, contactName: "Accounts Payable", companyName: "Northline EV Components", addressLine1: "800 Battery Park Dr", city: "Detroit", stateOrProvince: "MI", postalCode: "48201", country: "US" }
];

const notes1: OrderNote[] = [
  { id: "note-1", orderId: "ord-1", note: "Customer requests delivery before March 14", isInternal: false, createdBy: "Sarah Nguyen", createdAtUtc: "2026-03-01T09:00:00Z" },
  { id: "note-2", orderId: "ord-1", note: "Production scheduled on Line A", isInternal: true, createdBy: "Mike Johnson", createdAtUtc: "2026-03-02T08:30:00Z" }
];

const history1: OrderStatusHistory[] = [
  { id: "sh-1", orderId: "ord-1", fromStatus: OrderStatus.Draft, toStatus: OrderStatus.PendingApproval, changedBy: "Sarah Nguyen", changedAtUtc: "2026-03-01T08:30:00Z" },
  { id: "sh-2", orderId: "ord-1", fromStatus: OrderStatus.PendingApproval, toStatus: OrderStatus.Approved, changedBy: "Mike Johnson", changedAtUtc: "2026-03-01T10:00:00Z", comments: "Approved — stock available" },
  { id: "sh-3", orderId: "ord-1", fromStatus: OrderStatus.Approved, toStatus: OrderStatus.Processing, changedBy: "System", changedAtUtc: "2026-03-01T14:00:00Z" }
];

export const orderDetailsMock: Record<string, OrderDetail> = {
  "ord-1": {
    id: "ord-1",
    orderNumber: "SO-1024",
    status: OrderStatus.Processing,
    paymentStatus: PaymentStatus.PartiallyPaid,
    totalAmount: 8160.00,
    paidAmount: 4000.00,
    outstandingAmount: 4160.00,
    currencyCode: "USD",
    customerName: "Northline EV Components",
    customerEmail: "orders@northline-ev.example",
    customerPhone: "+1-555-0150",
    orderType: OrderType.Sales,
    priority: OrderPriority.High,
    channel: OrderChannel.Email,
    orderDateUtc: "2026-03-01T08:30:00Z",
    requiredDateUtc: "2026-03-14T00:00:00Z",
    referenceNumber: "NL-PO-4421",
    customerPurchaseOrderNumber: "CPO-4421",
    notes: "Rush order — EV production deadline",
    items: items1,
    addresses: addresses1,
    notesList: notes1,
    statusHistory: history1,
    payments: payments1
  },
  "ord-2": {
    id: "ord-2",
    orderNumber: "SO-1025",
    status: OrderStatus.PendingApproval,
    paymentStatus: PaymentStatus.Unpaid,
    totalAmount: 5280.00,
    paidAmount: 0,
    outstandingAmount: 5280.00,
    currencyCode: "USD",
    customerName: "Urban Build Systems",
    customerEmail: "procurement@urbanbuild.example",
    orderType: OrderType.Sales,
    priority: OrderPriority.Normal,
    channel: OrderChannel.Web,
    orderDateUtc: "2026-03-02T11:00:00Z",
    requiredDateUtc: "2026-03-20T00:00:00Z",
    items: items2,
    addresses: [],
    notesList: [],
    statusHistory: [
      { id: "sh-4", orderId: "ord-2", fromStatus: OrderStatus.Draft, toStatus: OrderStatus.PendingApproval, changedBy: "Web Portal", changedAtUtc: "2026-03-02T11:00:00Z" }
    ],
    payments: []
  }
};
