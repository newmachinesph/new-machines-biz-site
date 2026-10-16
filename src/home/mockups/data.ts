import type { ComponentProps } from "react";
import type { Status } from "@/design-system/components/Badge";
import { MARKETPLACE_LISTINGS, type MarketplaceListing } from "@/marketplace/listings";
import type { AgentPortrait } from "./AgentPortrait";

export { KIND_FILTER_GROUP_LABEL, KIND_FILTERS, KIND_LABEL, type Kind, type KindFilter } from "@/marketplace/kinds";

type PortraitKind = NonNullable<ComponentProps<typeof AgentPortrait>["kind"]>;

/** Recent runs of the platform Workflow Packs, with per-run costs in USD as the app shows them. */
export type DemoRun = { id: string; agent: string; status: Status; cost: string };

export const DEMO_RUNS: readonly DemoRun[] = [
  { id: "run_01HX4QK2", agent: "Order-to-Cash Exception Desk", status: "running", cost: "$1.84" },
  { id: "run_01HX4QJ7", agent: "Inbox Lead Tracker", status: "running", cost: "$0.12" },
  { id: "run_01HX4QHM", agent: "Refund Triage", status: "waiting-for-human", cost: "$1.10" },
  { id: "run_01HX4QG3", agent: "Support Inbox Triage", status: "waiting-for-human", cost: "$0.64" },
  { id: "run_01HX4QFA", agent: "Order & Payment Reconciliation", status: "verified", cost: "$1.92" },
  { id: "run_01HX4QEN", agent: "Weekly Expense Check", status: "verified", cost: "$0.38" },
];

export const DEMO_EVIDENCE = [
  { title: "Orders matched", meta: "run_01HX4QFA · 1 sheet" },
  { title: "Refund decisions confirmed", meta: "run_01HX4QHM · 3 drafts" },
  { title: "Expense summary drafted", meta: "run_01HX4QEN · 1 draft" },
] as const;

/** The marketplace functions the home packs belong to (the app's taxonomy). */
export const PACK_FUNCTIONS = ["Finance operations", "Customer operations", "Sales operations"] as const;
export type PackFunction = (typeof PACK_FUNCTIONS)[number];

export type AppMark = Readonly<{ name: string; src: `/brands/${string}.svg` }>;
const GMAIL: AppMark = { name: "Gmail", src: "/brands/connectors/gmail.svg" };
const SHEETS: AppMark = { name: "Google Sheets", src: "/brands/connectors/googlesheets.svg" };
const SHOPIFY: AppMark = { name: "Shopify", src: "/brands/connectors/shopify.svg" };
const STRIPE: AppMark = { name: "Stripe", src: "/brands/connectors/stripe.svg" };
const BUSINESS_APP: AppMark = { name: "Business app, read-only", src: "/brands/connectors/modelcontextprotocol.svg" };

/** Who does the work in a pack: its agents, and the person in the loop. */
export type PackMember = Readonly<{ name: string; portrait: PortraitKind }>;

type HomePack = Readonly<{
  slug: string;
  function: PackFunction;
  members: readonly PackMember[];
  apps: readonly AppMark[];
  /** Used only while the marketplace catalogue does not carry this slug. */
  fallback: Pick<MarketplaceListing, "title" | "kind" | "body" | "price" | "certified" | "portrait">;
}>;

/** The six platform packs on the home page, in the marketplace's order (the catalogue's first six listings). */
const HOME_PACKS: readonly HomePack[] = [
  {
    slug: "order-to-cash-exception-desk", function: "Finance operations",
    members: [{ name: "Order-to-Cash Triage Agent", portrait: "invoice" }, { name: "Collections Writer", portrait: "contract" }, { name: "You approve once", portrait: "human" }],
    apps: [BUSINESS_APP, GMAIL],
    fallback: { title: "Order-to-Cash Exception Desk", kind: "pack", body: "Every order followed from store to warehouse to ledger, with each break found and acted on after one approval.", price: "About $0.80–$3.00 / run", certified: true, portrait: "pack" },
  },
  {
    slug: "order-payment-reconciliation", function: "Finance operations",
    members: [{ name: "Finance Agent", portrait: "invoice" }, { name: "Operations Agent", portrait: "brief" }, { name: "Invoice reviewer", portrait: "human" }],
    apps: [SHOPIFY, STRIPE, SHEETS],
    fallback: { title: "Order & Payment Reconciliation", kind: "pack", body: "Every order matched to a payment, with exceptions reviewed by a person.", price: "About $0.60–$2.40 / run", certified: true, portrait: "invoice" },
  },
  {
    slug: "refund-triage", function: "Customer operations",
    members: [{ name: "Refunds Agent", portrait: "receipt" }, { name: "Writer Agent", portrait: "support" }, { name: "Reviewer", portrait: "human" }],
    apps: [GMAIL, SHOPIFY, STRIPE],
    fallback: { title: "Refund Triage", kind: "pack", body: "Every refund request matched to its order and payment, with a proposed decision and a reply drafted.", price: "About $0.60–$2.40 / run", certified: true, portrait: "receipt" },
  },
  {
    slug: "support-inbox-triage", function: "Customer operations",
    members: [{ name: "Support Agent", portrait: "support" }, { name: "Writer Agent", portrait: "contract" }, { name: "Reviewer", portrait: "human" }],
    apps: [GMAIL, SHEETS],
    fallback: { title: "Support Inbox Triage", kind: "pack", body: "Every customer email sorted, complaints and refund requests checked by a person, replies drafted and each case logged.", price: "About $0.30–$1.50 / run", certified: true, portrait: "support" },
  },
  {
    slug: "inbox-lead-tracker", function: "Sales operations",
    members: [{ name: "Lead Agent", portrait: "leads" }, { name: "You approve the rows", portrait: "human" }],
    apps: [GMAIL, SHEETS],
    fallback: { title: "Inbox Lead Tracker", kind: "pack", body: "Every real enquiry in your inbox added to your leads sheet, with who asked, what for and how soon.", price: "About $0.05–$0.40 / run", certified: true, portrait: "leads" },
  },
  {
    slug: "weekly-expense-check", function: "Finance operations",
    members: [{ name: "Expense Agent", portrait: "receipt" }, { name: "Writer Agent", portrait: "support" }, { name: "Reviewer", portrait: "human" }],
    apps: [SHEETS, GMAIL],
    fallback: { title: "Weekly Expense Check", kind: "pack", body: "A week of expenses sorted by category, anything unusual checked by a person, and a summary in your inbox.", price: "About $0.20–$1.00 / run", certified: true, portrait: "brief" },
  },
];

export const HOME_PACK_SLUGS: readonly string[] = HOME_PACKS.map((pack) => pack.slug);

export type DemoListing = Pick<MarketplaceListing, "slug" | "title" | "kind" | "body" | "price" | "certified" | "portrait"> & Pick<HomePack, "function" | "members" | "apps"> & { hovered?: boolean };

/** The homepage mockup's six packs. Each is read from the marketplace catalogue by slug, so its title, outcome,
 *  price and portrait stay the catalogue's; a slug the catalogue does not carry yet falls back to the entry above. */
export const DEMO_LISTINGS: readonly DemoListing[] = HOME_PACKS.map((pack, index) => {
  const listing = MARKETPLACE_LISTINGS.find((candidate) => candidate.slug === pack.slug);
  const { title, kind, body, price, certified, portrait } = listing ?? pack.fallback;
  return { slug: pack.slug, title, kind, body, price, certified, portrait, function: pack.function, members: pack.members, apps: pack.apps, ...(index === 1 ? { hovered: true } : {}) };
});

export const DEMO_STEPS = ["Read inputs", "Draft output", "Check policy", "Human review", "Verify evidence"] as const;

/** An illustrative month of spend per pack, in US cents (the app's currency). */
export const DEMO_PACK_SPEND = [
  { name: "Order-to-Cash Exception Desk", runs: 22, verified: true, cents: 3630 },
  { name: "Refund Triage", runs: 18, verified: false, cents: 2520 },
  { name: "Support Inbox Triage", runs: 40, verified: true, cents: 3000 },
  { name: "Inbox Lead Tracker", runs: 64, verified: true, cents: 1280 },
  { name: "Weekly Expense Check", runs: 4, verified: true, cents: 240 },
] as const;

/** Illustrative log. Reviewers (fictional names) give verdicts; approving a write is the business's own call. */
export const DEMO_LOG = [
  { id: "ap_9f31", who: "M. Tanaka", what: "gave a verdict: approve as is, run_01HX4QHM", at: "09:36:12 JST" },
  { id: "ap_9f2e", who: "policy v3", what: "authorised run_01HX4QG3", at: "09:31:40 JST" },
  { id: "ap_9f2a", who: "S. Lim", what: "gave a verdict: send back, run_01HX4QD9", at: "08:28:05 SGT" },
  { id: "ap_9f27", who: "verifier", what: "verified run_01HX4QFA", at: "09:22:58 JST" },
  { id: "ap_9f21", who: "You", what: "approved 2 writes, run_01HX4QCX", at: "09:19:33 KST" },
  { id: "ap_9f1d", who: "policy v3", what: "blocked run_01HX4QBB", at: "09:12:07 JST" },
] as const;
