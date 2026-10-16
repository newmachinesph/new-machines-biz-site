import type { ComponentProps } from "react";
import type { AgentPortrait } from "@/home/mockups/AgentPortrait";
import type { Kind } from "./kinds";

export type PortraitKind = NonNullable<ComponentProps<typeof AgentPortrait>["kind"]>;
export type ListingTool = { name: string; src: `/brands/${string}.svg` };
export type ListingReviewer = Readonly<{ name: string; role: string; city: string }>;

export type MarketplaceListing = {
  /** kebab-case, unique; the `/marketplace/[slug]` segment. Matches the pack or agent key in the product. */
  slug: string;
  title: string;
  kind: Kind;
  /** One line for cards and the homepage mockup. For packs, the pack's outcome as the product states it. */
  body: string;
  price: string;
  /** The most reviewer time a run can add, for packs with a review step (e.g. "$7.50"). Shown next to the price. */
  reviewUpTo?: string;
  /** Marked Certified: a platform listing published by New Machines Labs. */
  certified: boolean;
  /** The person who contributed the pack, credited next to the publisher. */
  contributor?: string;
  /** Which AgentPortrait glyph represents the listing. */
  portrait: PortraitKind;
  /** Two or three sentences for the detail hero. */
  summary: string;
  /** "What it does" bullets. */
  scope: readonly string[];
  /** Unused by platform listings: the product never assigns a named reviewer. Kept for the type's consumers. */
  reviewer?: ListingReviewer;
  /** Brand marks that ship under public/brands. */
  tools: readonly ListingTool[];
};

const SHEETS: ListingTool = { name: "Google Sheets", src: "/brands/google-sheets-official.svg" };
const GMAIL: ListingTool = { name: "Gmail", src: "/brands/gmail-official.svg" };
const CALENDAR: ListingTool = { name: "Google Calendar", src: "/brands/google-calendar-official.svg" };
const SHOPIFY: ListingTool = { name: "Shopify", src: "/brands/connectors/shopify.svg" };
const STRIPE: ListingTool = { name: "Stripe", src: "/brands/connectors/stripe.svg" };
/** The Order-to-Cash pack reads a business app through a read-only MCP connection. */
const BUSINESS_APP: ListingTool = { name: "Business app (read-only, over MCP)", src: "/brands/connectors/modelcontextprotocol.svg" };

const INCLUDED = "Included in packs";

/** The eight platform packs, then the platform agents. The first six are the homepage mockup's DEMO_LISTINGS, in this
 *  order (MarketplaceGrid's portraits are index-aligned). Outcomes and prices follow each pack's definition. */
export const MARKETPLACE_LISTINGS: readonly MarketplaceListing[] = [
  {
    slug: "order-to-cash-exception-desk", title: "Order-to-Cash Exception Desk", kind: "pack", body: "Every order followed from store to warehouse to ledger, with each break found and acted on after one approval.", price: "About $0.80–$3.00 / run", certified: true, contributor: "Adrian Anton Ladia", portrait: "pack",
    summary: "Follows each order across the store, ledger, warehouse and sales-app sections of a business app. It finds payments waiting to be confirmed, orders shipped but not paid past their terms, orders paid but not shipped and disputed invoices, then asks you once before anything is written. Nothing is sent and no money moves.",
    scope: [
      "Read orders, payments, invoices and deliveries from the business app, read-only",
      "Follow each order from store to warehouse to ledger and name every break with its evidence",
      "Apply your collection policy to each exception",
      "Draft a reminder from each account manager for the largest overdue balances",
      "Ask you once, with every write counted, before anything is saved",
      "On approval, save the reminders as Gmail drafts and note pending payments, disputes and waiting orders for finance and the warehouse",
    ],
    tools: [BUSINESS_APP, GMAIL],
  },
  {
    slug: "order-payment-reconciliation", title: "Order & Payment Reconciliation", kind: "pack", body: "Every order matched to a payment, with exceptions reviewed by a person.", price: "About $0.60–$2.40 / run", reviewUpTo: "$7.50", certified: true, portrait: "invoice",
    summary: "Reads your orders and payment records, matches them line by line, and sends anything that does not add up to a qualified reviewer. You get a reconciliation report with the evidence behind every match.",
    scope: [
      "Read orders from Shopify and payments from Stripe",
      "Match each order to the payment that settled it",
      "Explain every mismatch in one plain sentence",
      "Send each mismatch to a reviewer: policy requires a person for any payment mismatch",
      "Write the checked results to your Google Sheet as rows and a summary, after your approval",
    ],
    tools: [SHOPIFY, STRIPE, SHEETS],
  },
  {
    slug: "refund-triage", title: "Refund Triage", kind: "pack", body: "Every refund request matched to its order and payment, with a proposed decision and a reply drafted.", price: "About $0.60–$2.40 / run", reviewUpTo: "$5.00", certified: true, portrait: "contract",
    summary: "Reads refund requests from your inbox, finds the order and payment each one is about, and proposes approve, partial or decline from your refund policy. A reviewer confirms every case, then it drafts a reply to each customer once you approve. It never issues a refund: a person does.",
    scope: [
      "Read refund requests from Gmail",
      "Find the order in Shopify and the payment in Stripe",
      "Propose approve, partial or decline from your refund policy",
      "Send every proposed decision to a reviewer to confirm",
      "Draft a reply to each customer once you approve. It never issues a refund",
    ],
    tools: [GMAIL, SHOPIFY, STRIPE],
  },
  {
    slug: "support-inbox-triage", title: "Support Inbox Triage", kind: "pack", body: "Every customer email sorted, complaints and refund requests checked by a person, replies drafted and each case logged.", price: "About $0.30–$1.50 / run", reviewUpTo: "$5.00", certified: true, portrait: "support",
    summary: "Reads recent customer emails, sorts each one as a question, a complaint, a refund request or spam, and leaves the spam out. A reviewer checks every complaint and refund request. Once you approve, it saves the replies as Gmail drafts and logs each case in your Google Sheet; it never sends an email or issues a refund.",
    scope: [
      "Read recent customer emails",
      "Sort each one with a separate decision model: question, complaint, refund request or spam",
      "Send every complaint and refund request to a reviewer, and every case if the decision model is not available",
      "Draft a reply to each customer",
      "Once you approve, save the replies as Gmail drafts and log each case in your sheet",
    ],
    tools: [GMAIL, SHEETS],
  },
  {
    slug: "inbox-lead-tracker", title: "Inbox Lead Tracker", kind: "pack", body: "Every real enquiry in your inbox added to your leads sheet, with who asked, what for and how soon.", price: "About $0.05–$0.40 / run", certified: true, portrait: "leads",
    summary: "Checks the last week of your inbox for real enquiries from potential customers and how soon each sender wants an answer. It picks out the name, company and request of each one and, once you approve, adds one row per lead to your leads sheet. It never replies to or changes your email.",
    scope: [
      "Read the last week of your inbox",
      "Sort real enquiries from the rest with a separate decision model",
      "Pick out who asked, their company, what they asked for and how soon",
      "Add one row per lead to the Leads tab once you approve",
      "If the decision model is not available, nothing is added",
    ],
    tools: [GMAIL, SHEETS],
  },
  {
    slug: "weekly-expense-check", title: "Weekly Expense Check", kind: "pack", body: "A week of expenses sorted by category, anything unusual checked by a person, and a summary in your inbox.", price: "About $0.20–$1.00 / run", reviewUpTo: "$5.00", certified: true, portrait: "receipt",
    summary: "Reads one week of expenses from your Google Sheet, puts each one in a category and flags missing receipts, items over your limit and likely duplicates. A reviewer checks anything flagged. Once you approve, it adds the summary to a tab of the sheet and emails it; it never changes or deletes your expense rows.",
    scope: [
      "Read one week of expenses from your Google Sheet",
      "Put each expense in a category",
      "Flag missing receipts, items over your limit and likely duplicates",
      "Send anything flagged to a reviewer",
      "Once you approve, add the summary to a tab of the sheet and email it",
    ],
    tools: [SHEETS, GMAIL],
  },
  {
    slug: "overdue-invoice-follow-up", title: "Overdue Invoice Follow-up", kind: "pack", body: "Every overdue invoice gets a reminder of the right firmness, drafted and ready for you to send.", price: "About $0.20–$1.00 / run", reviewUpTo: "$5.00", certified: true, portrait: "reminder",
    summary: "Reads your open invoices, works out how late each one is and how firm its reminder should be, and has a reviewer check the plan. Then it writes one short, polite reminder per invoice and saves them as email drafts once you approve. Nothing is sent without you.",
    scope: [
      "Read your open invoices from Stripe",
      "Work out how late each one is and how firm its reminder should be",
      "Send the reminder plan to a reviewer",
      "Write one short, polite reminder per invoice",
      "Save the reminders as Gmail drafts once you approve. Nothing is sent without you",
    ],
    tools: [STRIPE, GMAIL],
  },
  {
    slug: "meeting-follow-ups", title: "Meeting Follow-ups", kind: "pack", body: "A short follow-up drafted for everyone outside your team you met with, ready for you to check and send.", price: "About $0.05–$0.30 / run", certified: true, portrait: "calendar",
    summary: "Reads one day of your Google Calendar and plans a short follow-up for each guest from outside your team, using what the event says was agreed. Once you approve, it saves the follow-ups as Gmail drafts. Nothing is sent.",
    scope: [
      "Read one day of your Google Calendar",
      "Skip focus time, internal and cancelled meetings, and declined invitations",
      "Plan a short follow-up for each guest from outside your team",
      "Save the follow-ups as Gmail drafts once you approve. Nothing is sent",
    ],
    tools: [CALENDAR, GMAIL],
  },
  {
    slug: "order-to-cash-triage-agent", title: "Order-to-Cash Triage Agent", kind: "agent", body: "Follows each order across the store, ledger, warehouse and sales app, naming each break with evidence.", price: INCLUDED, certified: true, portrait: "brief",
    summary: "Follows each order across the business app's store, ledger, warehouse and sales-app sections, and names every break with the evidence from each section and the action the collection policy calls for, so a person can confirm it.",
    scope: [
      "Follow each order across four sections of the business app",
      "Name every break with the evidence from each section",
      "State the action your collection policy calls for",
      "Recommend only: a person approves before anything is written",
    ],
    tools: [BUSINESS_APP],
  },
  {
    slug: "finance-agent", title: "Finance Agent", kind: "agent", body: "Matches each order to the payment that settled it and explains any mismatch.", price: INCLUDED, certified: true, portrait: "invoice",
    summary: "Matches each order to the payment that settled it, and explains in one plain sentence any order or payment that does not line up, so a reviewer can act on it.",
    scope: [
      "Match each order to the payment that settled it",
      "Explain any order or payment that does not line up, in one plain sentence",
      "Hand every mismatch to a reviewer",
    ],
    tools: [SHOPIFY, STRIPE],
  },
  {
    slug: "support-agent", title: "Support Agent", kind: "agent", body: "Turns emails into cases and plans replies, sending complaints and refunds to a person.", price: INCLUDED, certified: true, portrait: "support",
    summary: "Turns each customer email into a case, plans a reply from your support policies and sends complaints and refund requests to a person. It never sends an email or issues a refund.",
    scope: [
      "Turn each customer email into a case",
      "Plan a reply from your support policies",
      "Send complaints and refund requests to a person",
    ],
    tools: [GMAIL],
  },
  {
    slug: "lead-agent", title: "Lead Agent", kind: "agent", body: "Turns enquiry emails into leads.", price: INCLUDED, certified: true, portrait: "leads",
    summary: "Turns each enquiry email into one lead: who asked, their company, what they asked for and how soon they want an answer, ready to add to your leads sheet. It never replies to anyone.",
    scope: [
      "Pick out who asked and their company",
      "Record what they asked for and how soon they want an answer",
      "Prepare one row per lead for your approval",
    ],
    tools: [GMAIL],
  },
  {
    slug: "writer-agent", title: "Writer Agent", kind: "agent", body: "Writes short, polite email drafts from given facts.", price: INCLUDED, certified: true, portrait: "contract",
    summary: "Writes one short, polite email draft per customer from the facts it is given, following any reviewer notes. It never promises refunds or payment terms that are not in the facts, and it only drafts: a person sends.",
    scope: [
      "Write one short draft per customer from the facts it is given",
      "Follow the reviewer's notes",
      "Never promise refunds or payment terms that are not in the facts",
    ],
    tools: [GMAIL],
  },
  {
    slug: "retail-agent", title: "Retail Agent", kind: "agent", body: "Reads store orders and points out unusual ones. Available for your own packs.", price: "Free in your packs", certified: true, portrait: "vendor",
    summary: "Reads your store's orders for a date range and points out the ones that look unusual, naming each order and why it stands out. It only reads orders and never changes them. It is not in a ready-made pack yet: add it to your own pack in the Developer Studio.",
    scope: [
      "Read your store's orders for a date range, read-only",
      "Point out the orders that look unusual",
      "Name each order and why it stands out",
    ],
    tools: [SHOPIFY],
  },
];

/** The review part of a pack's price, or undefined when the pack has no reviewer time. */
export function reviewPriceOf(listing: Pick<MarketplaceListing, "reviewUpTo">): string | undefined {
  return listing.reviewUpTo ? `+ up to ${listing.reviewUpTo} review` : undefined;
}

/** The price with any reviewer time, on one line: "About $0.60–$2.40 / run + up to $7.50 review". */
export function fullPriceOf(listing: Pick<MarketplaceListing, "price" | "reviewUpTo">): string {
  const review = reviewPriceOf(listing);
  return review ? `${listing.price} ${review}` : listing.price;
}

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
