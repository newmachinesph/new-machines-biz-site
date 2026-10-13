import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DEMO_LISTINGS, type DemoListing } from "@/home/mockups/data";
import { MARKETPLACE_COPY } from "./copy";
import { isKind } from "./kinds";
import { findListing, MARKETPLACE_LISTINGS, relatedListings } from "./listings";

const core = ({ title, kind, body, price, certified }: Pick<DemoListing, "title" | "kind" | "body" | "price" | "certified">) => ({ title, kind, body, price, certified });

describe("marketplace listings", () => {
  it("has twelve unique, URL-safe listings that begin with the homepage demo set", () => {
    expect(MARKETPLACE_LISTINGS).toHaveLength(12);
    const slugs = MARKETPLACE_LISTINGS.map((listing) => listing.slug);
    expect(new Set(slugs).size).toBe(12);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slugs.slice(0, 6)).toEqual(["invoice-matcher", "month-end-close-pack", "bilingual-contract-review", "lead-qualifier", "receipt-reconciler", "support-reply-drafter"]);
    expect(DEMO_LISTINGS).toHaveLength(6);
    expect(DEMO_LISTINGS.map((listing) => listing.portrait)).toEqual(["invoice", "pack", "human", "leads", "receipt", "support"]);
    expect(core(DEMO_LISTINGS[0])).toEqual({ title: "Invoice matcher", kind: "agent", body: "Matches supplier invoices to purchase orders.", price: "¥120 / run", certified: true });
    expect(DEMO_LISTINGS[1].hovered).toBe(true);
  });

  it("only references brand marks that ship with the site", () => {
    for (const listing of MARKETPLACE_LISTINGS) {
      expect(listing.tools.length).toBeGreaterThan(0);
      for (const tool of listing.tools) expect(existsSync(join(process.cwd(), "public", tool.src)), tool.src).toBe(true);
    }
  });

  it("names a reviewer for every human listing and pack", () => {
    for (const listing of MARKETPLACE_LISTINGS) {
      if (listing.kind === "agent") expect(listing.reviewer).toBeUndefined();
      else expect(listing.reviewer).toEqual({ name: expect.any(String), role: expect.any(String), city: expect.any(String) });
    }
  });

  it("finds listings by slug and relates them by kind without repeating the current one", () => {
    const pack = findListing("month-end-close-pack")!;
    expect(pack.kind).toBe("pack");
    expect(findListing("does-not-exist")).toBeUndefined();
    for (const listing of MARKETPLACE_LISTINGS) {
      const related = relatedListings(listing, 3);
      expect(related).toHaveLength(3);
      expect(related.map((item) => item.slug)).not.toContain(listing.slug);
      expect(new Set(related.map((item) => item.slug)).size).toBe(3);
    }
    expect(relatedListings(pack, 3)[0].kind).toBe("pack");
    expect(relatedListings(findListing("lead-qualifier")!, 3).every((item) => item.kind === "agent")).toBe(true);
  });

  it("recognises the three kinds and nothing else", () => {
    expect(isKind("agent")).toBe(true);
    expect(isKind("pack")).toBe(true);
    expect(isKind("human")).toBe(true);
    expect(isKind("robot")).toBe(false);
    expect(isKind(null)).toBe(false);
    expect(isKind(undefined)).toBe(false);
  });

  it("keeps the copy in the JAPAC register", () => {
    const text = JSON.stringify(MARKETPLACE_COPY) + JSON.stringify(MARKETPLACE_LISTINGS);
    expect(text).not.toMatch(/United States|\bUS\b|U\.S\./);
    expect(text).not.toMatch(/\d+%\s+(faster|more)|\d+x faster|trusted by/i);
  });
});
