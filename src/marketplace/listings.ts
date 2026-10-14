import type { ComponentProps } from "react";
import type { AgentPortrait } from "@/home/mockups/AgentPortrait";
import type { Kind } from "./kinds";

export type PortraitKind = NonNullable<ComponentProps<typeof AgentPortrait>["kind"]>;
export type ListingTool = { name: string; src: `/brands/${string}.svg` };
export type ListingReviewer = Readonly<{ name: string; role: string; city: string }>;

export type MarketplaceListing = {
  /** kebab-case, unique; the `/marketplace/[slug]` segment. */
  slug: string;
  title: string;
  kind: Kind;
  /** One line for cards and the homepage mockup. */
  body: string;
  price: string;
  /** Holds a Trust Passport. */
  certified: boolean;
  /** Which AgentPortrait glyph represents the listing. */
  portrait: PortraitKind;
  /** Two or three sentences for the detail hero. */
  summary: string;
  /** "Scope of work" bullets. */
  scope: readonly string[];
  /** The assigned reviewer, for human work and packs that include one. */
  reviewer?: ListingReviewer;
  /** Brand marks that ship under public/brands. */
  tools: readonly ListingTool[];
};

const DRIVE: ListingTool = { name: "Google Drive", src: "/brands/google-drive-official.svg" };
const SHEETS: ListingTool = { name: "Google Sheets", src: "/brands/google-sheets-official.svg" };
const GMAIL: ListingTool = { name: "Gmail", src: "/brands/gmail-official.svg" };
const CALENDAR: ListingTool = { name: "Google Calendar", src: "/brands/google-calendar-official.svg" };
const SLACK: ListingTool = { name: "Slack", src: "/brands/slack.svg" };
const NOTION: ListingTool = { name: "Notion", src: "/brands/notion.svg" };
const KINTONE: ListingTool = { name: "kintone", src: "/brands/kintone-official.svg" };
const FREEE: ListingTool = { name: "freee", src: "/brands/freee-official.svg" };
const SMARTHR: ListingTool = { name: "SmartHR", src: "/brands/smarthr-official.svg" };
const LINEWORKS: ListingTool = { name: "LINE WORKS", src: "/brands/lineworks-official.svg" };
const HUBSPOT: ListingTool = { name: "HubSpot", src: "/brands/hubspot.svg" };
const SALESFORCE: ListingTool = { name: "Salesforce", src: "/brands/salesforce.svg" };

/** The first six are the homepage mockup's DEMO_LISTINGS, in the same order (MarketplaceGrid's portraits are index-aligned). */
export const MARKETPLACE_LISTINGS: readonly MarketplaceListing[] = [
  {
    slug: "invoice-matcher", title: "Invoice matcher", kind: "agent", body: "Matches supplier invoices to purchase orders.", price: "¥120 / run", certified: true, portrait: "invoice",
    summary: "Checks that each supplier invoice is genuine and that its numbers agree with the purchase order and receiving report, then prepares a recommendation for a reviewer. It never approves or pays; a qualified person decides.",
    scope: ["Verify the supplier, bank details and PO against your records", "Check for duplicates, template changes and tampering signals", "Match invoice, PO and receiving report line by line", "Diagnose each exception with the arithmetic behind it", "Recommend approve, review or hold, with a full audit log"],
    tools: [DRIVE, SHEETS, FREEE],
  },
  {
    slug: "month-end-close-pack", title: "Month-end close pack", kind: "pack", body: "Reconcile, review exceptions, file evidence.", price: "¥48,000 / month", certified: true, portrait: "pack",
    summary: "A complete close: matching, reconciliation and a qualified reviewer for the exceptions. Every approval is recorded with the work, so the audit trail is ready when the month is.",
    scope: ["Match receipts and purchase orders across the month", "Route each exception to the assigned reviewer", "Record every approval with the related files", "Deliver a filed evidence pack on the last business day"],
    reviewer: { name: "M. Tanaka", role: "Finance reviewer", city: "Tokyo" },
    tools: [SHEETS, FREEE, SLACK],
  },
  {
    slug: "bilingual-contract-review", title: "Bilingual contract review", kind: "human", body: "Qualified reviewer, 日本語 ⇄ English, same day.", price: "¥9,800 / hour", certified: true, portrait: "human",
    summary: "A qualified reviewer reads the agreement in both languages and records a decision the same day. Scoped access, a written reason and nothing signed on your behalf.",
    scope: ["Review agreements in 日本語 and English", "Compare the translation against the governing text", "Record a decision with a written reason", "Return the file within the same business day"],
    reviewer: { name: "M. Tanaka", role: "Qualified reviewer", city: "Tokyo" },
    tools: [DRIVE, NOTION, SLACK],
  },
  {
    slug: "lead-qualifier", title: "Lead qualifier", kind: "agent", body: "Scores inbound leads against your ideal profile.", price: "¥60 / run", certified: true, portrait: "leads",
    summary: "Researches each inbound account, scores it against the profile you set and prepares a shortlist. Your team reviews the fit and owns the first conversation.",
    scope: ["Read inbound accounts from your CRM", "Research company context from public sources", "Score every account against your criteria", "Prepare an outreach brief for the shortlist"],
    tools: [HUBSPOT, SALESFORCE, GMAIL],
  },
  {
    slug: "receipt-reconciler", title: "Receipt reconciler", kind: "agent", body: "Reads receipts and flags mismatches.", price: "¥40 / run", certified: false, portrait: "receipt",
    summary: "Reads expense receipts, checks them against the ledger and flags anything that does not add up. Mismatches wait for a person; nothing is posted automatically.",
    scope: ["Read receipts from a shared folder", "Check amounts and dates against the ledger", "Flag duplicates and mismatches", "Prepare a summary for the bookkeeper"],
    tools: [DRIVE, FREEE, KINTONE],
  },
  {
    slug: "support-reply-drafter", title: "Support reply drafter", kind: "agent", body: "Drafts replies in 日本語 and English.", price: "¥25 / run", certified: false, portrait: "support",
    summary: "Drafts a helpful reply in the customer’s language with the account context attached. Sensitive cases are queued for a human who can make the call.",
    scope: ["Read the conversation and account context", "Draft a reply in 日本語 or English", "Check tone against your support policy", "Queue sensitive replies for review"],
    tools: [GMAIL, LINEWORKS, SLACK],
  },
  {
    slug: "vendor-intake-agent", title: "Vendor intake agent", kind: "agent", body: "Checks vendor applications and routes eligibility exceptions.", price: "¥90 / run", certified: true, portrait: "vendor",
    summary: "Collects each vendor’s documents, checks the required fields and prepares the register. Eligibility questions, such as an overseas supplier, go to someone who knows the answer.",
    scope: ["Collect vendor documents from the intake form", "Check required fields and registration numbers", "Route eligibility exceptions to a reviewer", "Prepare a reviewed vendor register"],
    tools: [KINTONE, SHEETS, SLACK],
  },
  {
    slug: "market-brief", title: "Market brief", kind: "agent", body: "Summarises market signals for an account or sector.", price: "¥330 / run", certified: true, portrait: "brief",
    summary: "Gathers recent signals about an account or sector and writes a short brief with sources. Every claim links back to where it came from.",
    scope: ["Read the account or sector you name", "Collect recent public signals and filings", "Write a one-page brief with cited sources", "Attach the sources as evidence"],
    tools: [DRIVE, NOTION, SALESFORCE],
  },
  {
    slug: "contract-clause-check", title: "Contract clause check", kind: "agent", body: "Flags clauses that differ from your standard terms.", price: "¥95 / run", certified: false, portrait: "contract",
    summary: "Compares an incoming agreement with your standard terms and marks every clause that differs. The reading is the agent’s; the decision stays with your reviewer.",
    scope: ["Read the agreement and your standard terms", "Mark clauses that differ, with the difference shown", "Group findings by risk category", "Hand the marked copy to a reviewer"],
    tools: [DRIVE, NOTION],
  },
  {
    slug: "quarterly-tax-pack", title: "Quarterly tax pack", kind: "pack", body: "Consumption tax workings, exception review, filed evidence.", price: "¥64,000 / quarter", certified: true, portrait: "pack",
    summary: "Consumption tax workings for the quarter, with a qualified reviewer for the exceptions and the evidence filed in one place. Nothing is submitted without a recorded approval.",
    scope: ["Prepare consumption tax workings from the ledger", "Separate exceptions for the assigned reviewer", "Record each approval with the supporting files", "File the evidence pack before the filing date"],
    reviewer: { name: "S. Lim", role: "Finance reviewer", city: "Singapore" },
    tools: [FREEE, SHEETS, CALENDAR],
  },
  {
    slug: "bilingual-support-review", title: "Bilingual support review", kind: "human", body: "Qualified support lead signs off sensitive 日本語 / English replies.", price: "¥6,800 / hour", certified: true, portrait: "human",
    summary: "A qualified support lead reads the drafted reply and the customer’s history, then approves, edits or escalates. The decision is recorded with the conversation.",
    scope: ["Review drafted replies in 日本語 and English", "Check tone, policy and the customer’s history", "Approve, edit or escalate with a reason", "Keep the decision with the conversation"],
    reviewer: { name: "A. Sato", role: "Support reviewer", city: "Tokyo" },
    tools: [LINEWORKS, GMAIL, SLACK],
  },
  {
    slug: "payroll-exception-review", title: "Payroll exception review", kind: "human", body: "Payroll specialist checks flagged runs before pay day.", price: "¥12,000 / hour", certified: false, portrait: "human",
    summary: "A payroll specialist checks every flagged run before pay day, with scoped access to the records that need it. Approvals are logged; nothing is paid on the agent’s say-so.",
    scope: ["Review flagged payroll runs before the cut-off", "Check allowances and deductions against policy", "Approve or hold each run with a reason", "Leave an append-only record for the audit"],
    reviewer: { name: "J. Park", role: "Operations reviewer", city: "Seoul" },
    tools: [SMARTHR, SHEETS, CALENDAR],
  },
];

export function findListing(slug: string): MarketplaceListing | undefined {
  return MARKETPLACE_LISTINGS.find((listing) => listing.slug === slug);
}

/** Same kind first, then the rest, in catalogue order; never the listing itself. */
export function relatedListings(listing: MarketplaceListing, count: number): MarketplaceListing[] {
  const others = MARKETPLACE_LISTINGS.filter((candidate) => candidate.slug !== listing.slug);
  const sameKind = others.filter((candidate) => candidate.kind === listing.kind);
  const otherKinds = others.filter((candidate) => candidate.kind !== listing.kind);
  return [...sameKind, ...otherKinds].slice(0, count);
}
