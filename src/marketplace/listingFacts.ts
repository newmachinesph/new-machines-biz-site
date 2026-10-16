/** What the product states about each platform listing, beyond the card: version, who does the work, where a person
 *  comes in, the price note, risk class and taxonomy. Kept beside MARKETPLACE_LISTINGS so the listing type stays as it is. */

export const PUBLISHER = "New Machines Labs";
/** Where runs are processed. AI model requests are not pinned to a region. */
export const DATA_REGION = "Mumbai (asia-south1)";

export type PackFacts = Readonly<{
  kind: "pack";
  version: string;
  /** The pack's price note, as the product shows it. */
  priceNote: string;
  /** Who does the work, in the order the pack uses them. */
  agents: readonly string[];
  /** Where a person comes in, as the pack states it. */
  humanReview: string;
  /** True when the pack has a reviewer step (team or reviewer network); false when only your approval is needed. */
  reviewStep: boolean;
  risk: "Low" | "Medium";
  functionName: string;
  industries: readonly string[];
}>;

export type AgentFacts = Readonly<{
  kind: "agent";
  version: string;
  model: "Reasoning model" | "Fast model";
  /** The ready-made packs it works in; empty when it is only available for your own packs. */
  usedIn: readonly string[];
}>;

export type ListingFacts = PackFacts | AgentFacts;

const RETAIL = "Retail & Commerce";
const MANUFACTURING = "Manufacturing";
const MEDIA = "Media, Content & Digital Experiences";
const PRO_SERVICES = "Professional Services";
const DECISION_MODEL = "a separate decision model";

export const LISTING_FACTS: Readonly<Record<string, ListingFacts>> = {
  "order-to-cash-exception-desk": {
    kind: "pack", version: "1.0.0", priceNote: "About $0.80 to $3.00 of AI work per run. No reviewer time: you approve the actions yourself.",
    agents: ["Order-to-Cash Triage Agent", "Collections Writer", "Order-to-Cash Report Agent"],
    humanReview: "One approval before anything is written. It counts every write and the pesos at stake. If it is not granted, the run ends with the report and nothing is sent or posted.",
    reviewStep: false, risk: "Medium", functionName: "Finance operations", industries: [MANUFACTURING, RETAIL],
  },
  "order-payment-reconciliation": {
    kind: "pack", version: "1.0.0", priceNote: "About $0.60 to $2.40 of AI work per run, plus up to $7.50 of reviewer time when a mismatch needs a person.",
    agents: ["Finance Agent", "Operations Agent"],
    humanReview: "Mismatches go to an invoice reviewer. Policy requires a person for any payment mismatch.",
    reviewStep: true, risk: "Medium", functionName: "Finance operations", industries: [RETAIL, MANUFACTURING],
  },
  "refund-triage": {
    kind: "pack", version: "1.1.1", priceNote: "About $0.60 to $2.40 of AI work per run, plus up to $5.00 of reviewer time to confirm the decisions.",
    agents: ["Refunds Agent", "Writer Agent"],
    humanReview: "A reviewer confirms every proposed refund decision. Policy requires a person for any refund.",
    reviewStep: true, risk: "Medium", functionName: "Customer operations", industries: [RETAIL],
  },
  "support-inbox-triage": {
    kind: "pack", version: "1.0.0", priceNote: "About $0.30 to $1.50 of AI work per run, plus up to $5.00 of reviewer time for complaints and refund requests.",
    agents: ["Support Agent", "Writer Agent", DECISION_MODEL],
    humanReview: "A reviewer checks every complaint and refund request before any reply is drafted, and every case when the decision model is not available.",
    reviewStep: true, risk: "Medium", functionName: "Customer operations", industries: [RETAIL, PRO_SERVICES, MEDIA],
  },
  "inbox-lead-tracker": {
    kind: "pack", version: "1.0.0", priceNote: "About $0.05 to $0.40 of AI work per run. No reviewer time.",
    agents: ["Lead Agent", DECISION_MODEL],
    humanReview: "No reviewer. You approve the rows before anything is added to your sheet.",
    reviewStep: false, risk: "Low", functionName: "Sales operations", industries: [PRO_SERVICES, MEDIA],
  },
  "weekly-expense-check": {
    kind: "pack", version: "1.0.0", priceNote: "About $0.20 to $1.00 of AI work per run, plus up to $5.00 of reviewer time when expenses are flagged.",
    agents: ["Expense Agent", "Writer Agent"],
    humanReview: "A reviewer checks every flagged expense before the summary is written. A week with nothing unusual needs only your approval.",
    reviewStep: true, risk: "Medium", functionName: "Finance operations", industries: [PRO_SERVICES, MEDIA, RETAIL],
  },
  "overdue-invoice-follow-up": {
    kind: "pack", version: "1.1.1", priceNote: "About $0.20 to $1.00 of AI work per run, plus up to $5.00 of reviewer time to check the reminder plan.",
    agents: ["Collections Agent", "Writer Agent"],
    humanReview: "A reviewer checks which invoices are overdue and how firm each reminder is before any draft is written. You approve the drafts.",
    reviewStep: true, risk: "Medium", functionName: "Finance operations", industries: [RETAIL, MANUFACTURING],
  },
  "meeting-follow-ups": {
    kind: "pack", version: "1.0.0", priceNote: "About $0.05 to $0.30 of AI work per run. No reviewer time.",
    agents: ["Meeting Agent", "Writer Agent"],
    humanReview: "No reviewer. You approve the follow-ups before any draft is saved.",
    reviewStep: false, risk: "Low", functionName: "Operations", industries: [PRO_SERVICES, MEDIA],
  },
  "order-to-cash-triage-agent": { kind: "agent", version: "1.0.0", model: "Reasoning model", usedIn: ["Order-to-Cash Exception Desk"] },
  "finance-agent": { kind: "agent", version: "1.1.0", model: "Reasoning model", usedIn: ["Order & Payment Reconciliation"] },
  "support-agent": { kind: "agent", version: "1.0.0", model: "Reasoning model", usedIn: ["Support Inbox Triage"] },
  "lead-agent": { kind: "agent", version: "1.0.0", model: "Fast model", usedIn: ["Inbox Lead Tracker"] },
  "writer-agent": { kind: "agent", version: "1.0.0", model: "Fast model", usedIn: ["Overdue Invoice Follow-up", "Refund Triage", "Support Inbox Triage", "Weekly Expense Check", "Meeting Follow-ups"] },
  "retail-agent": { kind: "agent", version: "1.1.0", model: "Reasoning model", usedIn: [] },
};

export function factsFor(slug: string): ListingFacts | undefined {
  return LISTING_FACTS[slug];
}

/** Words the catalogue search also matches: the pack's function and industries, or the packs an agent works in. */
export function factsSearchText(slug: string): string {
  const facts = factsFor(slug);
  if (!facts) return "";
  return facts.kind === "pack" ? [facts.functionName, ...facts.industries, ...facts.agents].join(" ") : facts.usedIn.join(" ");
}
