import type { MetadataRoute } from "next";
import { MARKETPLACE_LISTINGS } from "@/marketplace/listings";
import { KIND_LABEL } from "@/marketplace/kinds";

/** Search-result description bounds (characters). */
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 160;
/** `<title>` bound, including the layout's " · New Machines" suffix. */
export const TITLE_MAX = 60;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export type SeoRoute = Readonly<{
  /** Pathname, no host, no trailing slash ("/" for the home page). */
  path: string;
  /** The search-result description: 120–160 characters, factual, one claim per clause. Overrides the page copy's `meta.description`. */
  description: string;
  /** ISO date (YYYY-MM-DD) of the last content change. Bump it when the page's copy changes; the sitemap's lastModified reads it. */
  updated: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}>;

export const HOME_ROUTE: SeoRoute = { path: "/", description: "New Machines is a marketplace: businesses choose Workflow Packs and the AI agents inside them, add reviewers for judgment and accept outcomes with evidence.", updated: "2026-10-17", changeFrequency: "weekly", priority: 1 };

/** Every public page route. `/styleguide` is deliberately absent (SEO.neverIndex). */
export const PAGE_ROUTES: readonly SeoRoute[] = [
  HOME_ROUTE,
  { path: "/product", description: "Choose a Workflow Pack, run it on your apps or simulated data, approve every write, and accept each outcome with a work receipt. People make the judgment calls.", updated: "2026-10-17", changeFrequency: "monthly", priority: 0.9 },
  { path: "/marketplace", description: "Browse Workflow Packs and the agents inside them. Every listing shows its outcome, the apps it uses, what it can change and its estimated price per run.", updated: "2026-10-17", changeFrequency: "weekly", priority: 0.9 },
  { path: "/pricing", description: "Start on the Trial plan. Usage-based pricing per run, with each pack's estimate shown before you add it, inside caps you set. Billing is simulated pre-launch.", updated: "2026-10-17", changeFrequency: "monthly", priority: 0.8 },
  { path: "/developers", description: "Build agents and Workflow Packs in the Developer Studio, test them on sandbox apps and submit them for listing. New Machines reviews every version first.", updated: "2026-10-17", changeFrequency: "monthly", priority: 0.7 },
  { path: "/trust", description: "Trust boundaries live in code, not prompts. Judgment, policy, approval, execution, verification, acceptance and settlement stay separate, each with evidence.", updated: "2026-10-17", changeFrequency: "monthly", priority: 0.8 },
  { path: "/work", description: "Qualified people review and correct the work AI agents prepare. Claim a task after seeing its pay and time; network pay is simulated during pre-launch.", updated: "2026-10-17", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", description: "New Machines is the marketplace for verified intelligent work: AI agents do the work, qualified people make the calls, evidence you can inspect. Japan first.", updated: "2026-10-17", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", description: "Talk to New Machines about work you need done, reviewing work, or publishing an agent. Japan and Asia-Pacific, in 日本語 and English. We reply as soon as we can.", updated: "2026-10-17", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", description: "How New Machines collects, uses and protects information during pre-launch, in plain language: account data, workspace content, connected data and your choices.", updated: "2026-10-17", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", description: "The terms on which New Machines provides its website, marketplace and workspace during pre-launch. Plain language, reviewed by counsel before commercial launch.", updated: "2026-10-17", changeFrequency: "yearly", priority: 0.3 },
];

/** Listing summaries are written for the page, not the search result: keep whole sentences up to the maximum and name the listing kind. */
export function clampDescription(text: string, kindLabel?: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g)?.map((s) => s.trim()) ?? [text.trim()];
  let out = "";
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > DESCRIPTION_MAX) break;
    out = next;
  }
  if (!out) out = `${text.slice(0, DESCRIPTION_MAX - 1).replace(/\s+\S*$/, "")}…`;
  const label = kindLabel ? ` ${kindLabel} listing on New Machines.` : " Listing on New Machines.";
  if (out.length < DESCRIPTION_MIN && out.length + label.length <= DESCRIPTION_MAX) out += label;
  return out;
}

/** One route per marketplace listing. `updated` follows the listing data. */
export const LISTING_ROUTES: readonly SeoRoute[] = MARKETPLACE_LISTINGS.map((listing) => ({
  path: `/marketplace/${listing.slug}`,
  description: clampDescription(listing.summary, KIND_LABEL[listing.kind]),
  updated: "2026-10-17",
  changeFrequency: "monthly",
  priority: 0.6,
}));

export const SITEMAP_ROUTES: readonly SeoRoute[] = [...PAGE_ROUTES, ...LISTING_ROUTES];

export function findRoute(path: string): SeoRoute | undefined {
  const clean = path.length > 1 ? path.replace(/\/$/, "") : path;
  return SITEMAP_ROUTES.find((route) => route.path === clean);
}
