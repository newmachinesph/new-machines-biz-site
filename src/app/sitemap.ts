import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/site/seo/config";
import { SITEMAP_ROUTES } from "@/site/seo/routes";

// Static, so the Firebase static export ships /sitemap.xml too. Routes and dates live in src/site/seo/routes.ts.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(route.updated),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
