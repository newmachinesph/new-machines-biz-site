/** The Invoice matcher's output contract: one JSON document per run, read by the reviewer UI. The agent only recommends. */

export type CheckStatus = "pass" | "warn" | "fail" | "could_not_check";
export type RiskLevel = "low" | "medium" | "high";
export type Recommendation = "approve" | "review" | "hold";
export type Likelihood = "high" | "medium" | "low";

export type DocumentCheck = { check: string; status: CheckStatus; reason: string };
export type LineItem = { item: string; quantity: number; price: number };
export type ReceivedItem = { item: string; quantity: number };
/** The supplier document as photographed or captured, redacted: a public path with its pixel size. */
export type DocumentPhoto = { src: string; width: number; height: number; alt: string };
export type LikelyCause = { cause: string; evidence: string; likelihood: Likelihood };
export type MatchException = { line: string; difference: number; likely_causes: readonly LikelyCause[]; suggested_action: string };
/** One supplier invoice matched three ways: what was billed, what was ordered and what the warehouse counted in. */
export type MatchRecord = {
  supplier: string;
  invoice: { number: string; date: string; amount: number; items: readonly LineItem[] };
  purchase_order: { number: string; amount: number; items: readonly LineItem[] };
  received: { number: string; items: readonly ReceivedItem[] };
  recommendation: Recommendation;
  photo?: DocumentPhoto;
};
/** One item's quantity on each document; a document without the item counts it as zero. */
export type LineComparison = { item: string; invoice: number; po: number; received: number; status: "match" | "exception" };

export type InvoiceMatchRun = {
  run_id: string;
  risk_level: RiskLevel;
  recommendation: Recommendation;
  requires_onboarding: boolean;
  summary: string;
  document_checks: readonly DocumentCheck[];
  record: MatchRecord;
  exceptions: readonly MatchException[];
  notify: readonly ("reviewer" | "business_owner")[];
  audit: { tools_called: readonly string[]; data_sources_checked: readonly string[]; checked_at: string };
};

/** Checks judged from the document itself rather than a database record; the UI labels them so the reviewer can tell. */
export const APPEARANCE_CHECKS: ReadonlySet<string> = new Set(["Template matches history", "No tampering signals"]);

const quantityOf = (lines: readonly ReceivedItem[], item: string) => lines.find((line) => line.item === item)?.quantity ?? 0;

/** Every item on any of the three documents, in invoice order, with its quantity on each. */
export function lineComparisons(record: MatchRecord): LineComparison[] {
  const documents = [record.invoice.items, record.purchase_order.items, record.received.items];
  return [...new Set(documents.flat().map((line) => line.item))].map((item) => {
    const [invoice, po, received] = documents.map((lines) => quantityOf(lines, item));
    return { item, invoice, po, received, status: invoice === po && po === received ? "match" : "exception" };
  });
}

/** The items whose PO, received and invoice quantities disagree. */
export const lineDiffs = (record: MatchRecord) => lineComparisons(record).filter((line) => line.status === "exception");

/** Routing from the task rules: any fail in identity, payment, legitimacy or PO is high; could_not_check there is at least medium. */
const GATED = new Set(["Supplier identity", "Bank details unchanged", "No duplicate invoice", "PO matches database record"]);

export function riskFor(run: Pick<InvoiceMatchRun, "document_checks" | "record" | "requires_onboarding">): RiskLevel {
  const checks = run.document_checks;
  if (checks.some((c) => GATED.has(c.check) && c.status === "fail")) return "high";
  if (checks.some((c) => c.check === "No tampering signals" && c.status === "warn") && checks.some((c) => c.status === "fail")) return "high";
  if (run.requires_onboarding || checks.some((c) => c.status !== "pass") || lineDiffs(run.record).length > 0) return "medium";
  return "low";
}

/** How many of the run's document checks passed. */
export const checksPassed = (run: Pick<InvoiceMatchRun, "document_checks">) => run.document_checks.filter((check) => check.status === "pass").length;

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
/** A small count as a capitalised word ("Seven"), digits beyond ten. */
export const countWord = (n: number) => WORDS[n] ?? String(n);

export const yen = (n: number) => `¥${n.toLocaleString("en-US")}`;
/** Billed value of the lines: quantity times unit price. */
export const lineTotal = (lines: readonly LineItem[]) => lines.reduce((sum, line) => sum + line.quantity * line.price, 0);

export const RECOMMENDATION_FOR: Record<RiskLevel, Recommendation> = { low: "approve", medium: "review", high: "hold" };

const line = (item: string, quantity: number, price: number): LineItem => ({ item, quantity, price });
const counted = (lines: readonly LineItem[]): ReceivedItem[] => lines.map(({ item, quantity }) => ({ item, quantity }));
const priced = (items: readonly LineItem[]) => ({ amount: lineTotal(items), items });

/** Real invoices with the supplier names and dates changed; item names, quantities and prices are as billed (originally PHP, shown as ¥). No VAT. */
const ASTER_INVOICE = [line("Bathroom Tissue Virgin Pulp", 19, 264), line("Interfolded Paper Towel Virgin Pulp", 63, 735), line("Jumbo Roll Tissue Virgin Pulp", 12, 648), line("Quarter Folded Table Napkin Virgin Pulp", 35, 488)];
const ASTER_PO = [line("Bathroom Tissue Virgin Pulp", 19, 264), line("Interfolded Paper Towel Virgin Pulp", 64, 735), line("Jumbo Roll Tissue Virgin Pulp", 11, 648), line("Quarter Folded Table Napkin Virgin Pulp", 35, 488)];
const KUMO_INVOICE = [line("Metal Rack", 4, 7_000)];
const ASTER_REPEAT_INVOICE = [line("Bathroom Tissue Virgin Pulp", 70, 264), line("Interfolded Paper Towel Virgin Pulp", 15, 735)];

const ASTER_EXCEPTION: MatchException = {
  line: "PO quantities",
  difference: lineTotal(ASTER_PO) - lineTotal(ASTER_INVOICE),
  likely_causes: [
    { cause: "PO not revised after a quantity change at dispatch", evidence: "The receiving record matches the receipt line for line: 63 paper towels and 12 jumbo rolls. −1 × ¥735 + 1 × ¥648 = −¥87, the whole difference.", likelihood: "high" },
    { cause: "Short shipment billed at the full PO", evidence: "The receipt already bills 63 paper towels, not the 64 ordered, so nothing is billed that was not received.", likelihood: "low" },
    { cause: "Wrong item delivered", evidence: "Item names and unit prices match on every line of the receipt, PO and receiving record.", likelihood: "low" },
  ],
  suggested_action: "Revise the PO to 63 paper towels and 12 jumbo rolls, then approve ¥76,177.",
};

const ASTER: MatchRecord = { supplier: "Aster Supply", invoice: { number: "030679", date: "2026-10-09", ...priced(ASTER_INVOICE) }, purchase_order: { number: "PO-4417", ...priced(ASTER_PO) }, received: { number: "RR-0918", items: counted(ASTER_INVOICE) }, recommendation: "review",
  photo: { src: "/demo/invoices/aster-030679.jpg", width: 1034, height: 1478, alt: "Aster Supply warehouse receipt 030679, photographed; supplier and personal details redacted" } };

/** One batch of three: two documents match three ways, one needs its PO revised. Aster 028222 is the same supplier's previous order. */
export const SAMPLE_BATCH: readonly MatchRecord[] = [
  ASTER,
  { supplier: "Kumo Racks", invoice: { number: "014592", date: "2026-10-06", ...priced(KUMO_INVOICE) }, purchase_order: { number: "PO-4402", ...priced(KUMO_INVOICE) }, received: { number: "RR-0903", items: counted(KUMO_INVOICE) }, recommendation: "approve",
    photo: { src: "/demo/invoices/kumo-014592.jpg", width: 1074, height: 1086, alt: "Kumo Racks sales invoice 014592, handwritten; supplier and personal details redacted" } },
  { supplier: "Aster Supply", invoice: { number: "028222", date: "2026-10-07", ...priced(ASTER_REPEAT_INVOICE) }, purchase_order: { number: "PO-4409", ...priced(ASTER_REPEAT_INVOICE) }, received: { number: "RR-0911", items: counted(ASTER_REPEAT_INVOICE) }, recommendation: "approve",
    photo: { src: "/demo/invoices/aster-028222.jpg", width: 961, height: 627, alt: "Aster Supply warehouse receipt 028222; supplier and personal details redacted" } },
];

/** Sandbox run NM-2291: Aster Supply's receipt 030679. The supplier changed two quantities at dispatch and the PO was never revised. */
export const SAMPLE_RUN: InvoiceMatchRun = {
  run_id: "NM-2291",
  risk_level: "medium",
  recommendation: "review",
  requires_onboarding: false,
  summary: "Documents check out and the warehouse count matches receipt 030679, but two PO lines still carry the original quantities: the PO is ¥87 above the receipt.",
  document_checks: [
    { check: "Supplier identity", status: "pass", reason: "Onboarded; name, TIN and address match the vendor master." },
    { check: "Bank details unchanged", status: "pass", reason: "Cash-with-order terms; payee matches, no new bank details." },
    { check: "No duplicate invoice", status: "pass", reason: "Receipt 030679 is new; no same number or amount on file." },
    { check: "Template matches history", status: "pass", reason: "Layout and form code match Aster receipt 028222 from the last order." },
    { check: "PO matches database record", status: "pass", reason: "PO approved, not yet invoiced, and identical to its stored record." },
    { check: "No tampering signals", status: "pass", reason: "Phone photo; handwritten quantity and amount corrections, each initialled; no digital edits." },
    { check: "Receiving report matches", status: "pass", reason: "Counted 19 · 63 · 12 · 35, line for line with the receipt." },
  ],
  record: ASTER,
  exceptions: [ASTER_EXCEPTION],
  notify: ["reviewer"],
  audit: {
    tools_called: ["vendor_master.find", "invoice_history.find", "purchase_orders.find", "receiving_records.find", "image.inspect_metadata"],
    data_sources_checked: ["Vendor master", "Invoice history", "PO records", "Receiving records"],
    checked_at: "2026-10-09T09:14:02+08:00",
  },
};
