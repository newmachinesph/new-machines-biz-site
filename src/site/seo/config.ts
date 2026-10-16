import type { Metadata, MetadataRoute } from "next";
import { SITE } from "@/site/copy";

/** The canonical host. `metadataBase`, every canonical, the sitemap, robots.txt and every JSON-LD `@id` derive from it.
 *  SITE.url (src/site/copy.ts) is the single place to change it. */
export const SITE_ORIGIN: string = SITE.url;

export const SEO = {
  origin: SITE_ORIGIN,
  /** The launch switch. `false` = pre-launch: every page is noindex/nofollow and robots.txt disallows everything
   *  (the sitemap is still listed so it can be validated). Flip to `true` at launch.
   *  The Firebase header `X-Robots-Tag: noindex, ...` in firebase-hosting/firebase.json is outside this repo and
   *  must be removed in the same release. */
  indexable: false,
  /** BCP 47 for `inLanguage`; Open Graph gets the territory form. */
  language: "en",
  ogLocale: "en_US",
  sitemapPath: "/sitemap.xml",
  /** Routes that exist but never belong in search results, even after launch. */
  neverIndex: ["/styleguide"],
} as const;

/** `https://newmachin.es` for "/", `https://newmachin.es/product` otherwise, matching the canonicals Next emits. */
export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The layout's `robots` metadata (the `<meta name="robots">` tag on every page). */
export function robotsMetadata(indexable: boolean = SEO.indexable): NonNullable<Metadata["robots"]> {
  if (indexable) return { index: true, follow: true };
  return { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } };
}

/** robots.txt. Pre-launch disallows everything but still names the sitemap; at launch it allows all but `neverIndex`. */
export function robotsRules(indexable: boolean = SEO.indexable): MetadataRoute.Robots {
  const sitemap = absoluteUrl(SEO.sitemapPath);
  if (!indexable) return { rules: [{ userAgent: "*", disallow: "/" }], sitemap };
  return { rules: [{ userAgent: "*", allow: "/", disallow: [...SEO.neverIndex] }], sitemap, host: SITE_ORIGIN };
}
