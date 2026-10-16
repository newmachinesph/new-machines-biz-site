/** A demo exception desk report in the shape the Order-to-Cash Exception Desk produces: totals, then one row per
 *  exception with the action taken and what happened to it. Every name and amount is invented for a fictional
 *  business; nothing here comes from a real customer or from the product's fixtures. Amounts are centavos. */

export type O2CExceptionKind = "payment_pending_confirmation" | "shipped_not_paid" | "paid_not_shipped" | "disputed";
export type O2COutcome = "drafted" | "noted" | "listed_only" | "not_sent";

export type O2CRow = Readonly<{
  orderId: string;
  customer: string;
  kind: O2CExceptionKind;
  amountMinor: number;
  note: string;
  action: string;
  outcome: O2COutcome;
}>;

export type O2CReportSample = Readonly<{
  business: string;
  summary: string;
  rows: readonly O2CRow[];
  actions: Readonly<{ remindersDrafted: number; financeNotes: number; warehouseNotes: number }>;
}>;

export const O2C_KINDS: readonly O2CExceptionKind[] = ["payment_pending_confirmation", "shipped_not_paid", "paid_not_shipped", "disputed"];

export const O2C_SAMPLE: O2CReportSample = {
  business: "Kalumpang Demo Supply Co.",
  summary: "6 exceptions across 4 demo customers. Reminders were drafted for the 2 largest overdue balances; a smaller one is listed only. Pending and disputed payments are noted for finance, and the paid order still waiting is noted for the warehouse.",
  rows: [
    { orderId: "SO-DEMO-1041", customer: "Bayan Demo Hardware", kind: "shipped_not_paid", amountMinor: 14_850_000, note: "Delivered on 30-day terms, 17 days past due.", action: "Reminder from the account manager", outcome: "drafted" },
    { orderId: "SO-DEMO-1052", customer: "Lakan Demo Foods", kind: "shipped_not_paid", amountMinor: 9_620_000, note: "Delivered on 30-day terms, 9 days past due.", action: "Reminder from the account manager", outcome: "drafted" },
    { orderId: "SO-DEMO-1058", customer: "Tala Demo Retail", kind: "shipped_not_paid", amountMinor: 1_875_000, note: "4 days past due, below the largest balances.", action: "Reminder held back", outcome: "listed_only" },
    { orderId: "SO-DEMO-1063", customer: "Alon Demo Builders", kind: "payment_pending_confirmation", amountMinor: 6_200_000, note: "Bank transfer reported by the customer, no matching receipt in the ledger.", action: "Flag for finance", outcome: "noted" },
    { orderId: "SO-DEMO-1067", customer: "Bayan Demo Hardware", kind: "paid_not_shipped", amountMinor: 3_490_000, note: "Paid in full, no delivery in the warehouse section.", action: "Note for the warehouse", outcome: "noted" },
    { orderId: "SO-DEMO-1070", customer: "Lakan Demo Foods", kind: "disputed", amountMinor: 2_160_000, note: "Customer reports four cases short on delivery.", action: "Flag for finance, no reminder", outcome: "noted" },
  ],
  actions: { remindersDrafted: 2, financeNotes: 2, warehouseNotes: 1 },
};

/** ₱148,500.00 from 14,850,000 centavos. */
export function peso(amountMinor: number): string {
  return `₱${(amountMinor / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Count and total per exception kind, as the report's facts show them. */
export function o2cTotals(rows: readonly O2CRow[]): Record<O2CExceptionKind, { count: number; amountMinor: number }> {
  const totals = Object.fromEntries(O2C_KINDS.map((kind) => [kind, { count: 0, amountMinor: 0 }])) as Record<O2CExceptionKind, { count: number; amountMinor: number }>;
  for (const row of rows) totals[row.kind] = { count: totals[row.kind].count + 1, amountMinor: totals[row.kind].amountMinor + row.amountMinor };
  return totals;
}
