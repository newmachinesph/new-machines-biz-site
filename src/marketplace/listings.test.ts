import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DEMO_LISTINGS } from "@/home/mockups/data";
import { MARKETPLACE_COPY } from "./copy";
import { isKind, KIND_FILTERS } from "./kinds";
import { factsFor, LISTING_FACTS } from "./listingFacts";
import { findListing, fullPriceOf, MARKETPLACE_LISTINGS, relatedListings } from "./listings";
import { appHref, previewHref } from "./listingLinks";

const PACKS = [
  "order-to-cash-exception-desk",
  "order-payment-reconciliation",
  "refund-triage",
  "support-inbox-triage",
  "inbox-lead-tracker",
  "weekly-expense-check",
  "overdue-invoice-follow-up",
  "meeting-follow-ups",
];
const AGENTS = ["order-to-cash-triage-agent", "finance-agent", "support-agent", "lead-agent", "writer-agent", "retail-agent"];

describe("marketplace listings", () => {
  it("lists the eight platform packs in the agreed order, then the platform agents", () => {
    const slugs = MARKETPLACE_LISTINGS.map((listing) => listing.slug);
    expect(slugs).toEqual([...PACKS, ...AGENTS]);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(MARKETPLACE_LISTINGS.filter((listing) => listing.kind === "pack").map((listing) => listing.slug)).toEqual(PACKS);
    expect(MARKETPLACE_LISTINGS.some((listing) => listing.kind === "human")).toBe(false);
    expect(DEMO_LISTINGS).toHaveLength(6);
    expect(DEMO_LISTINGS.map((listing) => listing.title)).toEqual(MARKETPLACE_LISTINGS.slice(0, 6).map((listing) => listing.title));
  });

  it("states each pack's outcome, a per-run USD estimate and no named reviewer", () => {
    const o2c = findListing("order-to-cash-exception-desk")!;
    expect(o2c.body).toBe("Every order followed from store to warehouse to ledger, with each break found and acted on after one approval.");
    expect(o2c.price).toBe("About $0.80–$3.00 / run");
    expect(o2c.tools.map((tool) => tool.src)).toEqual(["/brands/connectors/modelcontextprotocol.svg", "/brands/gmail-official.svg"]);
    for (const listing of MARKETPLACE_LISTINGS) {
      expect(listing.reviewer).toBeUndefined();
      expect(listing.certified).toBe(true);
      if (listing.kind === "pack") expect(listing.price).toMatch(/^About \$\d+\.\d{2}–\$\d+\.\d{2} \/ run$/);
      else expect(listing.price).not.toMatch(/[$¥]/);
    }
  });

  it("has facts for every listing, with the price note agreeing with the card", () => {
    expect(Object.keys(LISTING_FACTS).sort()).toEqual(MARKETPLACE_LISTINGS.map((listing) => listing.slug).sort());
    for (const listing of MARKETPLACE_LISTINGS) {
      const facts = factsFor(listing.slug)!;
      expect(facts.kind).toBe(listing.kind);
      if (facts.kind !== "pack") continue;
      const [, min, max] = listing.price.match(/\$(\d+\.\d{2})–\$(\d+\.\d{2})/)!;
      expect(facts.priceNote).toContain(`About $${min} to $${max} of AI work per run`);
      expect(facts.priceNote.includes("reviewer time when") || facts.priceNote.includes("reviewer time to") || facts.priceNote.includes("reviewer time for")).toBe(facts.reviewStep);
    }
  });

  it("only references brand marks that ship with the site", () => {
    for (const listing of MARKETPLACE_LISTINGS) {
      expect(listing.tools.length).toBeGreaterThan(0);
      for (const tool of listing.tools) expect(existsSync(join(process.cwd(), "public", tool.src)), tool.src).toBe(true);
    }
  });

  it("finds listings by slug and relates them by kind without repeating the current one", () => {
    const pack = findListing("refund-triage")!;
    expect(pack.kind).toBe("pack");
    expect(findListing("does-not-exist")).toBeUndefined();
    for (const listing of MARKETPLACE_LISTINGS) {
      const related = relatedListings(listing, 3);
      expect(related).toHaveLength(3);
      expect(related.map((item) => item.slug)).not.toContain(listing.slug);
      expect(new Set(related.map((item) => item.slug)).size).toBe(3);
    }
    expect(relatedListings(pack, 3).every((item) => item.kind === "pack")).toBe(true);
    expect(relatedListings(findListing("lead-agent")!, 3).every((item) => item.kind === "agent")).toBe(true);
  });

  it("keeps the human kind in the type but offers only the app's views", () => {
    expect(isKind("agent")).toBe(true);
    expect(isKind("pack")).toBe(true);
    expect(isKind("human")).toBe(true);
    expect(isKind("robot")).toBe(false);
    expect(isKind(null)).toBe(false);
    expect(isKind(undefined)).toBe(false);
    expect(KIND_FILTERS.map((filter) => filter.label)).toEqual(["All", "Packs", "Agents"]);
  });

  it("keeps the copy honest: no vendors, no yen prices, no human-work listings, hire only for people", () => {
    const text = JSON.stringify(MARKETPLACE_COPY) + JSON.stringify(MARKETPLACE_LISTINGS) + JSON.stringify(LISTING_FACTS);
    expect(text).not.toMatch(/model|provider|Gemini|OpenAI|OpenRouter|Composio|TypeSafe|\bJev\b/i);
    expect(text).not.toMatch(/Trust Passport|Assigned reviewer|Request this reviewer|\/ month|\/ hour|\/ quarter/);
    expect(text).not.toMatch(/\bhir(e|es|ed|ing)\b/i);
    expect(JSON.stringify(MARKETPLACE_LISTINGS)).not.toMatch(/¥/);
    expect(text).not.toMatch(/\d+%\s+(faster|more)|\d+x faster|trusted by/i);
  });
});

describe("listing prices and links", () => {
  it("states reviewer time next to the price exactly where the pack's facts do", () => {
    for (const listing of MARKETPLACE_LISTINGS.filter((item) => item.kind === "pack")) {
      const facts = factsFor(listing.slug);
      const note = facts && facts.kind === "pack" ? facts.priceNote : "";
      if (listing.reviewUpTo) expect(note).toContain(`up to ${listing.reviewUpTo} of reviewer time`);
      else expect(note).not.toMatch(/up to \$\d/);
    }
    expect(fullPriceOf(findListing("order-payment-reconciliation")!)).toBe("About $0.60–$2.40 / run + up to $7.50 review");
    expect(fullPriceOf(findListing("inbox-lead-tracker")!)).toBe("About $0.05–$0.40 / run");
  });

  it("previews each listing in its own team's chapter and opens its page in the app", () => {
    expect(previewHref("support-inbox-triage")).toBe("/?workflow=support#work-explorer");
    expect(previewHref("inbox-lead-tracker")).toBe("/?workflow=sales#work-explorer");
    for (const listing of MARKETPLACE_LISTINGS) expect(previewHref(listing.slug)).toMatch(/^\/\?workflow=(finance|sales|operations|support)#work-explorer$/);
    expect(appHref(findListing("order-to-cash-exception-desk")!)).toMatch(/\/app\/marketplace\/order-to-cash-exception-desk$/);
    expect(appHref(findListing("order-to-cash-triage-agent")!)).toMatch(/\/app\/agents\/o2c-triage-agent$/);
  });

  it("credits the contributor of the Order-to-Cash Exception Desk", () => {
    expect(findListing("order-to-cash-exception-desk")!.contributor).toBe("Adrian Anton Ladia");
  });

  it("gives every pack its own portrait", () => {
    const packs = MARKETPLACE_LISTINGS.filter((item) => item.kind === "pack");
    expect(new Set(packs.map((item) => item.portrait)).size).toBe(packs.length);
  });
});
