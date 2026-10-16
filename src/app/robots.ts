import type { MetadataRoute } from "next";
import { robotsRules } from "@/site/seo/config";

// Static, so it also works for the Firebase static export. Pre-launch (SEO.indexable = false) disallows every crawler
// but still names the sitemap; flipping SEO.indexable opens the site. The layout's robots meta reads the same switch.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return robotsRules();
}
