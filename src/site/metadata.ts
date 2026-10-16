import type { Metadata } from "next";
import { SITE } from "./copy";

/** Per-page metadata: the layout's title template adds " · New Machines"; Open Graph and Twitter get the full title. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} · ${SITE.name}`;
  // A page-level openGraph object replaces the layout's, so the shared share card (app/opengraph-image.tsx) is named here.
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE.name} - ${SITE.tagline}` }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: path, type: "website", siteName: SITE.name, images },
    twitter: { card: "summary_large_image", title: full, description, images },
  };
}
