import type { Metadata } from "next";
import { SITE } from "./copy";
import { SEO } from "./seo/config";
import { clampDescription, findRoute } from "./seo/routes";

/** Per-page metadata: the layout's title template adds " · New Machines"; Open Graph and Twitter get the full title.
 *  The search-result description comes from src/site/seo/routes.ts when the route is listed there (120–160 characters);
 *  the page copy's own description is the fallback, clamped to whole sentences. Canonicals resolve against metadataBase. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} · ${SITE.name}`;
  const summary = findRoute(path)?.description ?? clampDescription(description);
  // A page-level openGraph object replaces the layout's, so the shared share card (app/opengraph-image.tsx) is named here.
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE.name} - ${SITE.tagline}` }];
  return {
    title,
    description: summary,
    alternates: { canonical: path },
    openGraph: { title: full, description: summary, url: path, type: "website", siteName: SITE.name, locale: SEO.ogLocale, images },
    twitter: { card: "summary_large_image", title: full, description: summary, images },
  };
}
