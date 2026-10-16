import { MARKETPLACE_COPY } from "./copy";
import type { MarketplaceListing } from "./listings";

/** The home WorkExplorer chapters, selected with `/?workflow=<team>`. */
export type PreviewTeam = "finance" | "sales" | "operations" | "support";

/** Which WorkExplorer chapter previews each listing's kind of work. Unlisted slugs fall back to Finance. */
const PREVIEW_TEAM: Readonly<Record<string, PreviewTeam>> = {
  "order-to-cash-exception-desk": "finance",
  "order-payment-reconciliation": "finance",
  "overdue-invoice-follow-up": "finance",
  "order-to-cash-triage-agent": "finance",
  "finance-agent": "finance",
  "inbox-lead-tracker": "sales",
  "meeting-follow-ups": "sales",
  "lead-agent": "sales",
  "weekly-expense-check": "operations",
  "retail-agent": "operations",
  "support-inbox-triage": "support",
  "refund-triage": "support",
  "support-agent": "support",
  "writer-agent": "support",
};

/** Agent keys in the app where they differ from the site slug. */
const APP_AGENT_KEY: Readonly<Record<string, string>> = { "order-to-cash-triage-agent": "o2c-triage-agent" };

export function previewHref(slug: string): string {
  return `/?workflow=${PREVIEW_TEAM[slug] ?? "finance"}#work-explorer`;
}

/** The listing's own page in the app: `/app/marketplace/<slug>` for a pack, `/app/agents/<key>` for an agent.
 *  A signed-out visitor signs in first and lands back on it. */
export function appHref(listing: Pick<MarketplaceListing, "slug" | "kind">): string {
  const base = MARKETPLACE_COPY.listing.appHref.replace(/\/$/, "");
  if (listing.kind === "pack") return `${base}/app/marketplace/${listing.slug}`;
  if (listing.kind === "agent") return `${base}/app/agents/${APP_AGENT_KEY[listing.slug] ?? listing.slug}`;
  return base;
}
