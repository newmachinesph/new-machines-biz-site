import type { Metadata } from "next";
import { SITE } from "@/site/copy";
import { robotsMetadata, SEO } from "./config";
import { HOME_ROUTE } from "./routes";

/** The home page's title (≤ 60 characters); every other page sets its own through pageMetadata. */
export const DEFAULT_TITLE = `${SITE.name} · Marketplace for verified intelligent work`;

/** The root layout's metadata, kept here (no CSS imports) so tests can read it. metadataBase and the robots switch
 *  come from src/site/seo/config.ts; the description from src/site/seo/routes.ts. */
export function rootMetadata(): Metadata {
  const description = HOME_ROUTE.description;
  return {
    metadataBase: new URL(SEO.origin),
    title: { default: DEFAULT_TITLE, template: `%s · ${SITE.name}` },
    description,
    applicationName: SITE.name,
    openGraph: { type: "website", siteName: SITE.name, locale: SEO.ogLocale, url: "/", title: DEFAULT_TITLE, description },
    twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description },
    // Pre-launch: every page stays out of search engines until SEO.indexable flips. robots.ts reads the same switch;
    // the Firebase X-Robots-Tag header (firebase-hosting/firebase.json) must be removed in the same release.
    robots: robotsMetadata(),
  };
}
