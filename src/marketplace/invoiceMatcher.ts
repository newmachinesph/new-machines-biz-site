/** The Invoice matcher's output contract: one JSON document per run, read by the reviewer UI. The agent only recommends. */

export type CheckStatus = "pass" | "warn" | "fail" | "could_not_check";
export type RiskLevel = "low" | "medium" | "high";
export type Recommendation = "approve" | "review" | "hold";
export type Likelihood = "high" | "medium" | "low";

export type DocumentCheck = { check: string; status: CheckStatus; reason: string };
/** `received` is null where the receiving report carries no such line (tax). */
export type LineMatch = { line: string; invoice: number; po: number; received: number | null; status: "match" | "exception" };
export type LikelyCause = { cause: string; evidence: string; likelihood: Likelihood };
export type MatchException = { line: string; difference: number; likely_causes: readonly LikelyCause[]; suggested_action: string };

export type InvoiceMatchRun = {
  run_id: string;
  risk_level: RiskLevel;
  recommendation: Recommendation;
  requires_onboarding: boolean;
  summary: string;
  document_checks: readonly DocumentCheck[];
  line_matches: readonly LineMatch[];
  exceptions: readonly MatchException[];
  notify: readonly ("reviewer" | "business_owner")[];
  audit: { tools_called: readonly string[]; data_sources_checked: readonly string[]; checked_at: string };
};

/** Checks judged from the document itself rather than a database record; the UI labels them so the reviewer can tell. */
export const APPEARANCE_CHECKS: ReadonlySet<string> = new Set(["Template matches history", "No tampering signals"]);

/** Routing from the task rules: any fail in identity, payment, legitimacy or PO is high; could_not_check there is at least medium. */
const GATED = new Set(["Supplier identity", "Bank details unchanged", "No duplicate invoice", "PO matches database record"]);

export function riskFor(run: Pick<InvoiceMatchRun, "document_checks" | "line_matches" | "requires_onboarding">): RiskLevel {
  const checks = run.document_checks;
  if (checks.some((c) => GATED.has(c.check) && c.status === "fail")) return "high";
  if (checks.some((c) => c.check === "No tampering signals" && c.status === "warn") && checks.some((c) => c.status === "fail")) return "high";
  if (run.requires_onboarding || checks.some((c) => c.status !== "pass") || run.line_matches.some((l) => l.status === "exception")) return "medium";
  return "low";
}

export const RECOMMENDATION_FOR: Record<RiskLevel, Recommendation> = { low: "approve", medium: "review", high: "hold" };

/** Sandbox run NM-2291 (synthetic): Aster Supply's INV-2291 against PO-55120. The PO's tax was not recalculated after a line revision. */
export const SAMPLE_RUN: InvoiceMatchRun = {
  run_id: "NM-2291",
  risk_level: "medium",
  recommendation: "review",
  requires_onboarding: false,
  summary: "Documents check out; the PO’s tax is ¥1,200 short because it was not recalculated after a ¥12,000 line revision.",
  document_checks: [
    { check: "Supplier identity", status: "pass", reason: "Aster Supply is onboarded; TIN, legal name and address match the vendor master." },
    { check: "Bank details unchanged", status: "pass", reason: "Bank, account name and number match the vendor master and INV-2288." },
    { check: "No duplicate invoice", status: "pass", reason: "INV-2291 is new and follows INV-2288; no same-amount, same-date invoice on file." },
    { check: "Template matches history", status: "pass", reason: "Layout, logo, numbering and footer match the last six accepted invoices." },
    { check: "PO matches database record", status: "pass", reason: "PO-55120 is approved by S. Ito, not yet invoiced, and its lines match the stored record." },
    { check: "No tampering signals", status: "pass", reason: "Native PDF; created and last saved on the issue date; fonts consistent in every amount field." },
    { check: "Receiving report matches", status: "pass", reason: "GR-7741 confirms both lines delivered in full on 9 Oct 2026." },
  ],
  line_matches: [
    { line: "Operations services", invoice: 960_000, po: 960_000, received: 960_000, status: "match" },
    { line: "Software", invoice: 207_273, po: 207_273, received: 207_273, status: "match" },
    { line: "Consumption tax", invoice: 116_727, po: 115_527, received: null, status: "exception" },
  ],
  exceptions: [
    {
      line: "Consumption tax",
      difference: 1_200,
      likely_causes: [
        { cause: "PO tax not recalculated after a line revision", evidence: "Invoice tax ¥116,727 = 10% of ¥1,167,273, the sum of the lines. PO tax ¥115,527 = 10% of ¥1,155,273, which is ¥12,000 less. The PO lines match the invoice.", likelihood: "high" },
        { cause: "Price change after the PO was issued", evidence: "Would also explain a ¥12,000 base, but the stored PO lines already match the invoice.", likelihood: "low" },
        { cause: "Rounding method difference", evidence: "Rounding moves tax by ¥1 at most; it cannot explain ¥1,200.", likelihood: "low" },
      ],
      suggested_action: "Correct the PO tax to ¥116,727 and approve the invoice amount of ¥1,284,000.",
    },
  ],
  notify: ["reviewer"],
  audit: {
    tools_called: ["vendor_master.find", "invoice_history.find", "purchase_orders.find", "receiving_records.find", "pdf.inspect_metadata"],
    data_sources_checked: ["Vendor master", "Invoice history", "PO records", "Receiving records"],
    checked_at: "2026-10-11T09:14:02+09:00",
  },
};
