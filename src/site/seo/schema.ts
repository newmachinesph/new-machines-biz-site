import type { MarketplaceListing } from "@/marketplace/listings";
import { SITE } from "@/site/copy";
import { absoluteUrl, SEO, SITE_ORIGIN } from "./config";

/** schema.org builders. Facts only: no ratings, reviews, offers, founders, addresses or certifications, because none
 *  of those exist yet. Every object gets its own `@context` so it is valid alone or inside an array. */

const CONTEXT = "https://schema.org";
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
export const APPLICATION_ID = `${SITE_ORIGIN}/#platform`;

/** What the company is, in one sentence that every schema object and llms.txt repeat word for word. */
export const ORGANIZATION_DESCRIPTION =
  "New Machines is a marketplace for verified intelligent work: businesses choose AI agents and workflow packs for defined work, bring in qualified human reviewers where judgment is needed, and accept each outcome with evidence attached. Built for Japan and Asia-Pacific; pre-launch.";

export type FaqItem = Readonly<{ q: string; a: string }>;
export type Crumb = Readonly<{ name: string; path: string }>;

export function organizationSchema() {
  return {
    "@context": CONTEXT,
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE.name,
    url: SITE_ORIGIN,
    logo: { "@type": "ImageObject", url: absoluteUrl("/logo.svg"), width: 999, height: 999 },
    image: absoluteUrl("/opengraph-image"),
    description: ORGANIZATION_DESCRIPTION,
    slogan: SITE.tagline,
    email: SITE.email,
    areaServed: ["Japan", "Asia-Pacific"],
    knowsLanguage: ["en", "ja"],
    contactPoint: [
      { "@type": "ContactPoint", contactType: "sales", email: SITE.email, availableLanguage: ["English", "Japanese"] },
      { "@type": "ContactPoint", contactType: "security", email: SITE.securityEmail, availableLanguage: ["English", "Japanese"] },
    ],
  };
}

export function webSiteSchema() {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.name,
    alternateName: SITE.domain,
    url: SITE_ORIGIN,
    description: ORGANIZATION_DESCRIPTION,
    inLanguage: SEO.language,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** The platform itself. No `offers`: billing is simulated and nothing is collected pre-launch. */
export function softwareApplicationSchema() {
  return {
    "@context": CONTEXT,
    "@type": "SoftwareApplication",
    "@id": APPLICATION_ID,
    name: SITE.name,
    url: absoluteUrl("/product"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web browser",
    description: ORGANIZATION_DESCRIPTION,
    inLanguage: ["en", "ja"],
    publisher: { "@id": ORGANIZATION_ID },
    featureList: [
      "Marketplace of AI agents, workflow packs and qualified human work (demo catalogue during pre-launch)",
      "Sandbox: every listing runs on sample data, isolated from live systems",
      "Human review steps with scoped, redacted context and recorded decisions",
      "Spending caps and approval thresholds per organisation and per agent",
      "Work receipts: executed, verified, accepted and settlement-eligible recorded separately",
      "Scoped connectors to business tools, granted per agent",
      "Operator console to see, pause and reassign running work",
    ],
  };
}

export function faqPageSchema(items: readonly FaqItem[]) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbSchema(crumbs: readonly Crumb[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** The marketplace catalogue as a plain list of pages. Prices are left out: they are demo values. */
export function marketplaceItemListSchema(listings: readonly MarketplaceListing[]) {
  return {
    "@context": CONTEXT,
    "@type": "ItemList",
    name: "New Machines marketplace listings (demo catalogue)",
    url: absoluteUrl("/marketplace"),
    numberOfItems: listings.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: listings.map((listing, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: listing.title,
      description: listing.body,
      url: absoluteUrl(`/marketplace/${listing.slug}`),
    })),
  };
}
