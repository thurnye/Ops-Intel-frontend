import { OrderStatus, OrderType, OrderPriority, OrderChannel, PaymentStatus, PaymentMethod } from "@features/orders/types/orders.types";

/* ── Order status ─────────────────────────────────── */

export function orderStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    [OrderStatus.Draft]: "Draft",
    [OrderStatus.PendingApproval]: "Pending Approval",
    [OrderStatus.Approved]: "Approved",
    [OrderStatus.Processing]: "Processing",
    [OrderStatus.PartiallyFulfilled]: "Partially Fulfilled",
    [OrderStatus.Fulfilled]: "Fulfilled",
    [OrderStatus.Shipped]: "Shipped",
    [OrderStatus.Delivered]: "Delivered",
    [OrderStatus.Cancelled]: "Cancelled",
    [OrderStatus.Rejected]: "Rejected",
    [OrderStatus.Returned]: "Returned"
  };
  return map[status] ?? "Unknown";
}

export function orderStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Draft:
      return "#94a3b8";
    case OrderStatus.PendingApproval:
      return "#f59e0b";
    case OrderStatus.Approved:
    case OrderStatus.Processing:
      return "#3b82f6";
    case OrderStatus.PartiallyFulfilled:
      return "#8b5cf6";
    case OrderStatus.Fulfilled:
    case OrderStatus.Shipped:
    case OrderStatus.Delivered:
      return "#10b981";
    case OrderStatus.Cancelled:
    case OrderStatus.Rejected:
      return "#ef4444";
    case OrderStatus.Returned:
      return "#f97316";
    default:
      return "#94a3b8";
  }
}

/* ── Payment status ───────────────────────────────── */

export function paymentStatusLabel(status: PaymentStatus): string {
  const map: Record<PaymentStatus, string> = {
    [PaymentStatus.Unpaid]: "Unpaid",
    [PaymentStatus.Pending]: "Pending",
    [PaymentStatus.PartiallyPaid]: "Partially Paid",
    [PaymentStatus.Paid]: "Paid",
    [PaymentStatus.PartiallyRefunded]: "Partially Refunded",
    [PaymentStatus.Refunded]: "Refunded",
    [PaymentStatus.Failed]: "Failed",
    [PaymentStatus.Cancelled]: "Cancelled"
  };
  return map[status] ?? "Unknown";
}

export function paymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.Paid:
      return "#10b981";
    case PaymentStatus.Pending:
    case PaymentStatus.PartiallyPaid:
      return "#f59e0b";
    case PaymentStatus.Unpaid:
      return "#94a3b8";
    case PaymentStatus.Failed:
    case PaymentStatus.Cancelled:
      return "#ef4444";
    case PaymentStatus.Refunded:
    case PaymentStatus.PartiallyRefunded:
      return "#8b5cf6";
    default:
      return "#94a3b8";
  }
}

/* ── Order type ───────────────────────────────────── */

export function orderTypeLabel(type: OrderType): string {
  const map: Record<OrderType, string> = {
    [OrderType.Sales]: "Sales",
    [OrderType.Purchase]: "Purchase",
    [OrderType.Transfer]: "Transfer",
    [OrderType.Return]: "Return"
  };
  return map[type] ?? "Unknown";
}

/* ── Priority ─────────────────────────────────────── */

export function priorityLabel(p: OrderPriority): string {
  const map: Record<OrderPriority, string> = {
    [OrderPriority.Low]: "Low",
    [OrderPriority.Normal]: "Normal",
    [OrderPriority.High]: "High",
    [OrderPriority.Urgent]: "Urgent"
  };
  return map[p] ?? "Normal";
}

export function priorityColor(p: OrderPriority): string {
  switch (p) {
    case OrderPriority.Low:
      return "#94a3b8";
    case OrderPriority.Normal:
      return "#3b82f6";
    case OrderPriority.High:
      return "#f59e0b";
    case OrderPriority.Urgent:
      return "#ef4444";
    default:
      return "#94a3b8";
  }
}

/* ── Channel ──────────────────────────────────────── */

export function channelLabel(c: OrderChannel): string {
  const map: Record<OrderChannel, string> = {
    [OrderChannel.Internal]: "Internal",
    [OrderChannel.Web]: "Web",
    [OrderChannel.Mobile]: "Mobile",
    [OrderChannel.Phone]: "Phone",
    [OrderChannel.Email]: "Email",
    [OrderChannel.Marketplace]: "Marketplace"
  };
  return map[c] ?? "Unknown";
}

/* ── Payment method ───────────────────────────────── */

export function paymentMethodLabel(m: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    [PaymentMethod.Cash]: "Cash",
    [PaymentMethod.Card]: "Card",
    [PaymentMethod.BankTransfer]: "Bank Transfer",
    [PaymentMethod.MobileMoney]: "Mobile Money",
    [PaymentMethod.Cheque]: "Cheque",
    [PaymentMethod.Wallet]: "Wallet",
    [PaymentMethod.Other]: "Other"
  };
  return map[m] ?? "Unknown";
}

/* ── Formatting ───────────────────────────────────── */

export function formatCurrency(value: number, currency = "USD"): string {
  return value.toLocaleString("en-US", { style: "currency", currency });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
