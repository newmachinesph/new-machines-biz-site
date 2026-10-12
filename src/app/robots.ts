import type { MetadataRoute } from "next";

// Pre-launch: disallow all crawlers. Static, so it also works for the Firebase static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
