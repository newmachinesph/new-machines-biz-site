import { describe, expect, it } from "vitest";
import { HOME_COPY } from "@/home/copy";
import { MARKETPLACE_COPY } from "@/marketplace/copy";
import { ABOUT_COPY, CONTACT_COPY, DEVELOPERS_COPY, LEGAL_COPY, NOT_FOUND_COPY, PRICING_COPY, PRODUCT_COPY, TRUST_COPY, WORK_COPY } from "./copy";

/** Every route under src/app, plus the homepage anchors a link may target. Add here when a page or section is added. */
const ROUTES = ["/", "/marketplace", "/product", "/pricing", "/developers", "/trust", "/work", "/about", "/contact", "/privacy", "/terms", "/app"];
const HOME_ANCHORS = ["work-explorer", "customers", "hire", "sandbox", "trust", "human", "control", "integrations", "connectors", "customer-stories", "japac", "how", "faq"];

const ALL_COPY = { HOME_COPY, MARKETPLACE_COPY, PRODUCT_COPY, PRICING_COPY, DEVELOPERS_COPY, TRUST_COPY, WORK_COPY, ABOUT_COPY, CONTACT_COPY, LEGAL_COPY, NOT_FOUND_COPY };

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
  return out;
}

function hrefs(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((item) => hrefs(item, out));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (key === "href" && typeof item === "string") out.push(item);
      else hrefs(item, out);
    }
  }
  return out;
}

describe("site copy", () => {
  const text = strings(ALL_COPY).join("\n");

  it("never names a model vendor or an unfinished state", () => {
    expect(text).not.toMatch(/model|provider|OpenAI|\bJev\b|TypeSafe|OpenRouter|GPT|lorem|coming soon|TODO|placeholder/i);
  });

  it("reserves hiring for people", () => {
    const hires = text.match(/[^.]*\bhir(e|es|ed|ing)\b[^.]*/gi) ?? [];
    for (const sentence of hires) expect(sentence, sentence).toMatch(/reviewer|expert|people|human|person|qualified/i);
  });

  it("links only to routes and homepage sections that exist", () => {
    for (const href of hrefs(ALL_COPY)) {
      if (/^(https?:|mailto:)/.test(href)) continue;
      const [path, hash] = href.split("#");
      const route = path.split("?")[0];
      expect(ROUTES, href).toContain(route);
      if (hash) expect(HOME_ANCHORS, href).toContain(hash);
    }
  });

  it("gives every page a title and a description", () => {
    const metas = [PRODUCT_COPY.meta, PRICING_COPY.meta, DEVELOPERS_COPY.meta, TRUST_COPY.meta, WORK_COPY.meta, ABOUT_COPY.meta, CONTACT_COPY.meta, LEGAL_COPY.privacy.meta, LEGAL_COPY.terms.meta, MARKETPLACE_COPY.meta];
    for (const meta of metas) {
      expect(meta.title.length).toBeGreaterThan(2);
      expect(meta.description.length).toBeGreaterThan(40);
      expect(meta.description.length).toBeLessThanOrEqual(220);
    }
  });

  it("labels demo pricing as illustrative", () => {
    expect(PRICING_COPY.note).toMatch(/Illustrative/);
    expect(PRICING_COPY.examples.note).toMatch(/demo/i);
  });
});
