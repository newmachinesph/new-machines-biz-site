import { render } from "@testing-library/react";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  notFound: () => { throw new Error("notFound"); },
}));

import HomePage, { metadata as homeMetadata } from "@/app/page";
import AboutPage, { metadata as aboutMetadata } from "@/app/about/page";
import ContactPage, { metadata as contactMetadata } from "@/app/contact/page";
import DevelopersPage, { metadata as developersMetadata } from "@/app/developers/page";
import ListingPage, { generateMetadata as listingMetadata, generateStaticParams } from "@/app/marketplace/[slug]/page";
import MarketplacePage, { metadata as marketplaceMetadata } from "@/app/marketplace/page";
import PricingPage, { metadata as pricingMetadata } from "@/app/pricing/page";
import PrivacyPage, { metadata as privacyMetadata } from "@/app/privacy/page";
import ProductPage, { metadata as productMetadata } from "@/app/product/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import TermsPage, { metadata as termsMetadata } from "@/app/terms/page";
import TrustPage, { metadata as trustMetadata } from "@/app/trust/page";
import WorkPage, { metadata as workMetadata } from "@/app/work/page";
import { SITE } from "@/site/copy";
import { DEFINITION, SEO_FAQ_SETS } from "./answers";
import { absoluteUrl, robotsMetadata, robotsRules, SEO } from "./config";
import { rootMetadata } from "./rootMetadata";
import { DESCRIPTION_MAX, DESCRIPTION_MIN, LISTING_ROUTES, PAGE_ROUTES, SITEMAP_ROUTES, TITLE_MAX } from "./routes";
import { SiteJsonLd } from "./SiteJsonLd";

// The root layout's metadata without its CSS imports (src/app/layout.tsx spreads the same call).
const layoutMetadata = rootMetadata();

type StaticPage = { path: string; metadata: Metadata; Page: () => ReactElement; schemas: readonly string[] };

const STATIC_PAGES: readonly StaticPage[] = [
  { path: "/", metadata: homeMetadata, Page: HomePage, schemas: ["SoftwareApplication", "FAQPage"] },
  { path: "/product", metadata: productMetadata, Page: ProductPage, schemas: ["SoftwareApplication", "FAQPage"] },
  { path: "/marketplace", metadata: marketplaceMetadata, Page: MarketplacePage, schemas: ["BreadcrumbList", "ItemList"] },
  { path: "/pricing", metadata: pricingMetadata, Page: PricingPage, schemas: ["FAQPage"] },
  { path: "/developers", metadata: developersMetadata, Page: DevelopersPage, schemas: ["FAQPage"] },
  { path: "/trust", metadata: trustMetadata, Page: TrustPage, schemas: ["FAQPage"] },
  { path: "/work", metadata: workMetadata, Page: WorkPage, schemas: ["FAQPage"] },
  { path: "/about", metadata: aboutMetadata, Page: AboutPage, schemas: ["FAQPage"] },
  { path: "/contact", metadata: contactMetadata, Page: ContactPage, schemas: [] },
  { path: "/privacy", metadata: privacyMetadata, Page: PrivacyPage, schemas: [] },
  { path: "/terms", metadata: termsMetadata, Page: TermsPage, schemas: [] },
];

const SLUGS = generateStaticParams().map(({ slug }) => slug);
const listingProps = (slug: string) => ({ params: Promise.resolve({ slug }) });

type Schema = Record<string, unknown> & { "@context": string; "@type": string };

/** Every JSON-LD object in a rendered tree, arrays flattened. Throws if a block does not parse. */
function schemasIn(container: HTMLElement): Schema[] {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]')).flatMap((script) => {
    const parsed: unknown = JSON.parse(script.textContent ?? "");
    return (Array.isArray(parsed) ? parsed : [parsed]) as Schema[];
  });
}

/** The required shape per type, as the schema.org validators expect it. */
function expectValidShape(schema: Schema) {
  expect(schema["@context"]).toBe("https://schema.org");
  expect(typeof schema["@type"]).toBe("string");
  switch (schema["@type"]) {
    case "Organization":
    case "WebSite":
      expect(schema.name).toBe(SITE.name);
      expect(schema.url).toBe(SEO.origin);
      break;
    case "SoftwareApplication":
      expect(schema.name).toBe(SITE.name);
      expect(schema.applicationCategory).toBe("BusinessApplication");
      expect(typeof schema.operatingSystem).toBe("string");
      expect(schema).not.toHaveProperty("offers");
      expect(schema).not.toHaveProperty("aggregateRating");
      break;
    case "FAQPage": {
      const questions = schema.mainEntity as { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }[];
      expect(questions.length).toBeGreaterThanOrEqual(5);
      for (const q of questions) {
        expect(q["@type"]).toBe("Question");
        expect(q.name.length).toBeGreaterThan(8);
        expect(q.acceptedAnswer["@type"]).toBe("Answer");
        expect(q.acceptedAnswer.text.length).toBeGreaterThan(40);
      }
      break;
    }
    case "BreadcrumbList":
    case "ItemList": {
      const items = schema.itemListElement as { "@type": string; position: number; name: string; item?: string; url?: string }[];
      expect(items.length).toBeGreaterThan(0);
      items.forEach((item, i) => {
        expect(item["@type"]).toBe("ListItem");
        expect(item.position).toBe(i + 1);
        expect(item.name.length).toBeGreaterThan(0);
        expect(item.item ?? item.url).toMatch(new RegExp(`^${SEO.origin}`));
      });
      if (schema["@type"] === "ItemList") expect(schema.numberOfItems).toBe(items.length);
      break;
    }
    default:
      throw new Error(`unexpected schema type ${schema["@type"]}`);
  }
}

/** The visible FAQ pairs: every <details> with its <summary> question and <p> answer. */
function visibleFaq(container: HTMLElement) {
  return Array.from(container.querySelectorAll("details")).map((details) => ({
    q: details.querySelector("summary")?.textContent?.trim() ?? "",
    a: details.querySelector("p")?.textContent?.trim() ?? "",
  }));
}

const words = (text: string) => text.trim().split(/\s+/).length;
const fullTitle = (m: Metadata) => (typeof m.title === "string" ? `${m.title} · ${SITE.name}` : "");
const canonicalOf = (m: Metadata) => (typeof m.alternates?.canonical === "string" ? m.alternates.canonical : undefined);

describe("page metadata", () => {
  it("gives every page a unique title within 60 characters, a 120–160 character description and its own canonical", async () => {
    const layoutTitle = layoutMetadata.title as { default: string; template: string };
    const entries: { path: string; title: string; description: string; canonical?: string }[] = [
      { path: "/", title: layoutTitle.default, description: layoutMetadata.description ?? "", canonical: canonicalOf(homeMetadata) },
      ...STATIC_PAGES.filter((p) => p.path !== "/").map((p) => ({ path: p.path, title: fullTitle(p.metadata), description: p.metadata.description ?? "", canonical: canonicalOf(p.metadata) })),
    ];
    for (const slug of SLUGS) {
      const m = await listingMetadata(listingProps(slug));
      entries.push({ path: `/marketplace/${slug}`, title: fullTitle(m), description: m.description ?? "", canonical: canonicalOf(m) });
    }
    expect(layoutTitle.template).toBe(`%s · ${SITE.name}`);
    for (const entry of entries) {
      expect(entry.title.length, `${entry.path} title "${entry.title}"`).toBeGreaterThan(10);
      expect(entry.title.length, `${entry.path} title "${entry.title}"`).toBeLessThanOrEqual(TITLE_MAX);
      expect(entry.description.length, `${entry.path} description "${entry.description}"`).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
      expect(entry.description.length, `${entry.path} description "${entry.description}"`).toBeLessThanOrEqual(DESCRIPTION_MAX);
      expect(entry.canonical, `${entry.path} canonical`).toBe(entry.path);
    }
    expect(new Set(entries.map((e) => e.title)).size).toBe(entries.length);
    expect(new Set(entries.map((e) => e.description)).size).toBe(entries.length);
    expect(entries.map((e) => e.path).sort()).toEqual(SITEMAP_ROUTES.map((r) => r.path).sort());
  });

  it("uses one host everywhere and keeps the indexing switch in one place", () => {
    expect(new URL(String(layoutMetadata.metadataBase)).origin).toBe(SEO.origin);
    expect(absoluteUrl("/")).toBe(SEO.origin);
    expect(absoluteUrl("/product")).toBe(`${SEO.origin}/product`);
    expect(layoutMetadata.robots).toEqual(robotsMetadata());
    // Pre-launch: closed. After the flip: open, with the internal routes still out.
    expect(SEO.indexable).toBe(false);
    expect(robotsMetadata(false)).toMatchObject({ index: false, follow: false });
    expect(robotsMetadata(true)).toEqual({ index: true, follow: true });
    expect(robotsRules(true)).toMatchObject({ rules: [{ userAgent: "*", allow: "/", disallow: ["/styleguide"] }], host: SEO.origin });
  });
});

describe("sitemap and robots", () => {
  it("lists every page and every listing once, with a real last-modified date", () => {
    const entries = sitemap();
    expect(entries.map((e) => e.url).sort()).toEqual(SITEMAP_ROUTES.map((r) => absoluteUrl(r.path)).sort());
    expect(new Set(entries.map((e) => e.url)).size).toBe(PAGE_ROUTES.length + LISTING_ROUTES.length);
    expect(LISTING_ROUTES).toHaveLength(SLUGS.length);
    for (const entry of entries) {
      const date = entry.lastModified instanceof Date ? entry.lastModified : new Date(entry.lastModified ?? "");
      expect(Number.isNaN(date.getTime()), entry.url).toBe(false);
      // Dates are calendar days (UTC midnight), so allow the local day to run ahead of UTC.
      expect(date.getTime()).toBeLessThanOrEqual(Date.now() + 24 * 60 * 60 * 1000);
      expect(date.getFullYear()).toBeGreaterThanOrEqual(2026);
    }
    expect(entries.map((e) => e.url)).not.toContain(absoluteUrl("/styleguide"));
  });

  it("names the sitemap in robots.txt even while every crawler is disallowed", () => {
    const rules = robots();
    expect(rules.sitemap).toBe(`${SEO.origin}/sitemap.xml`);
    expect(rules.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
  });
});

describe("rendered pages", () => {
  it("renders the site entity once from the layout", () => {
    const { container } = render(<SiteJsonLd />);
    const schemas = schemasIn(container);
    expect(schemas.map((s) => s["@type"])).toEqual(["Organization", "WebSite"]);
    schemas.forEach(expectValidShape);
    const org = schemas[0];
    expect(org.email).toBe(SITE.email);
    expect(org).not.toHaveProperty("founder");
    expect(org).not.toHaveProperty("address");
    expect(org).not.toHaveProperty("aggregateRating");
  });

  it.each(STATIC_PAGES)("$path has one h1, a main landmark and valid JSON-LD", ({ path, Page, schemas: expected }) => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("h1"), `${path} h1`).toHaveLength(1);
    expect(container.querySelectorAll("main"), `${path} main`).toHaveLength(1);
    const schemas = schemasIn(container);
    expect(schemas.map((s) => s["@type"]).sort(), `${path} schema types`).toEqual([...expected].sort());
    schemas.forEach(expectValidShape);
    for (const faq of schemas.filter((s) => s["@type"] === "FAQPage")) {
      const visible = visibleFaq(container);
      const questions = faq.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
      for (const q of questions) expect(visible, `${path}: "${q.name}"`).toContainEqual({ q: q.name, a: q.acceptedAnswer.text });
    }
  });

  it("answers 'What is New Machines?' near the top of the home page and /product", () => {
    for (const Page of [HomePage, ProductPage]) {
      const { container } = render(<Page />);
      const headings = Array.from(container.querySelectorAll("h1, h2")).map((h) => h.textContent);
      expect(headings[1]).toBe(DEFINITION.question);
      expect(container.textContent).toContain(DEFINITION.answer);
    }
  });

  it.each(SLUGS)("/marketplace/%s has one h1 and a breadcrumb trail", async (slug) => {
    const { container } = render(await ListingPage(listingProps(slug)));
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    const schemas = schemasIn(container);
    expect(schemas.map((s) => s["@type"])).toEqual(["BreadcrumbList"]);
    schemas.forEach(expectValidShape);
    const crumbs = schemas[0].itemListElement as { name: string; item: string }[];
    expect(crumbs.map((c) => c.item)).toEqual([SEO.origin, `${SEO.origin}/marketplace`, `${SEO.origin}/marketplace/${slug}`]);
    expect(crumbs[2].name).toBe(container.querySelector("h1")?.textContent);
  });
});

describe("answer copy", () => {
  const faqText = SEO_FAQ_SETS.flatMap((set) => set.items.flatMap((item) => [item.q, item.a])).join("\n");

  it("keeps every FAQ answer between 40 and 60 words, with unique questions per page", () => {
    for (const set of SEO_FAQ_SETS) {
      expect(set.items.length).toBeGreaterThanOrEqual(5);
      expect(set.items.length).toBeLessThanOrEqual(8);
      expect(new Set(set.items.map((i) => i.q)).size).toBe(set.items.length);
      for (const item of set.items) {
        expect(words(item.a), `${set.id}: "${item.q}" has ${words(item.a)} words`).toBeGreaterThanOrEqual(40);
        expect(words(item.a), `${set.id}: "${item.q}" has ${words(item.a)} words`).toBeLessThanOrEqual(60);
        expect(item.q).toMatch(/\?$/);
      }
    }
  });

  it("stays in the site register: no model or integration vendors, hiring only for people, demo and pre-launch labelled", () => {
    const text = `${faqText}\n${DEFINITION.answer}\n${PAGE_ROUTES.map((r) => r.description).join("\n")}`;
    expect(text).not.toMatch(/model|provider|OpenAI|GPT|Composio|Temporal|Nango|WorkOS|Cerbos|Langfuse/i);
    expect(text).not.toMatch(/United States|\bU\.?S\.?\b/);
    for (const sentence of text.match(/[^.]*\bhir(e|es|ed|ing)\b[^.]*/gi) ?? []) expect(sentence, sentence).toMatch(/reviewer|expert|people|human|person|qualified/i);
    expect(DEFINITION.answer).toMatch(/^New Machines is /);
    expect(DEFINITION.answer).toMatch(/pre-launch/);
    expect(words(DEFINITION.answer)).toBeLessThanOrEqual(70);
  });
});
